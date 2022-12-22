#!/usr/bin/env python3
import os
import argparse
import json
from geojson import Point, Feature, FeatureCollection, dump
import requests
import psycopg2
from contextlib import closing


def get_routes(conn):
    cur = conn.cursor()
    query = """
        select distinct regexp_split_to_table(route_names_gttos,', ')
        from publish_qfanas.trafper100_edges_export
        union
        select distinct regexp_split_to_table(route_names_premium,', ')
        from publish_qfanas.trafper100_edges_export;
    """
    cur.execute(query)
    routes = [row[0] for row in cur.fetchall()]
    return routes


def get_contentful_data(contentful_url, contenful_token, contentful_limit):
    r = requests.get(contentful_url, params={
        "limit": contentful_limit,
        "access_token": contenful_token,
    })
    r.raise_for_status()
    data = r.json()
    return data


def is_poi(item):
    try:
        req_keys = [
            "title",
            "description",
            "leadText",
            "coordinates",
        ]
        return set(item["fields"].keys()) > set(req_keys)
    except KeyError:
        return False


def get_images(data):
    img_list = []
    for item in data["includes"]["Asset"]:
        fields = item["fields"]
        is_img = fields.get("file", {}).get("url", False)
        if is_img:
            img_list.append(
                {
                    "id": item["sys"]["id"],
                    "title": fields["title"],
                    "description": fields.get("description"),
                    "url": fields["file"]["url"],
                    "height": fields["file"]["details"]["image"]["height"],
                    "width": fields["file"]["details"]["image"]["width"],
                }
            )
    return img_list


def get_poi_images(item, img_list):
    poi_images = []
    if item["fields"].get("images"):
        for image_link in item["fields"]["images"]:
            for poi_image in img_list:
                if image_link["sys"]["id"] == poi_image["id"]:
                    poi_images.append(poi_image)
    return poi_images


def collect_content(conn, data):
    tours = get_routes(conn)
    img_list = get_images(data)
    poi_list, tour_list = [], []
    for item in data["items"]:
        if is_poi(item):
            fields = item["fields"]
            feature_id = item["sys"]["id"]
            poi_images = get_poi_images(item, img_list)
            geom = Point(
                (
                    fields["coordinates"]["lon"],
                    fields["coordinates"]["lat"],
                )
            )
            props = {
                "title": fields["title"],
                "lead_text": fields["leadText"],
                "description": fields["description"],
                "area_of_validity": fields.get("areaOfValidity"),
                "images": poi_images,
                "highlight_url": fields.get("highlightURL"),
            }
            if fields["title"] in tours:
                tour_list.append(props)
            poi_list.append(Feature(id=feature_id, geometry=geom, properties=props))
    return poi_list, tour_list


def write_files():
    parser = argparse.ArgumentParser()
    parser.add_argument("--db-url", required=True, help="Database URL")
    parser.add_argument("--contentful-url", required=True, help="Contenful API url")
    parser.add_argument("--contentful-token", required=True, help="Contenful API token")
    parser.add_argument("--contentful-limit", type=int, default=1000, help="Contenful limit parameter")
    parser.add_argument("output_dir")
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    pois_file = os.path.join(args.output_dir, "pois.geojson")
    tours_file = os.path.join(args.output_dir, "tours.json")

    data = get_contentful_data(
        args.contentful_url,
        args.contentful_token,
        args.contentful_limit,
    )
    with closing(psycopg2.connect(args.db_url)) as conn:
        poi_list, tour_list = collect_content(conn, data)
        with open(pois_file, "w", encoding="utf8") as f:
            feature_collection = FeatureCollection(poi_list)
            dump(feature_collection, f, ensure_ascii=False)
        with open(tours_file, "w", encoding="utf8") as file:
            json.dump(tour_list, file, ensure_ascii=False)


if __name__ == "__main__":
    write_files()
