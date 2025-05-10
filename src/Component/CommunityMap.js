import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

const CommunityMap = ({ onFeatureSelect }) => {
  const mapRef = useRef(null);
  const view = useRef(null);

  useEffect(() => {
    let localView;
    const localMapContainer = mapRef.current; // Cache mapRef

    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/widgets/Search",
        "esri/widgets/Locate",
        "esri/Graphic",
        "esri/layers/GraphicsLayer"
      ],
      { css: true }
    )
      .then(
        ([
          Map,
          MapView,
          FeatureLayer,
          Search,
          Locate,
          Graphic,
          GraphicsLayer
        ]) => {
          const map = new Map({ basemap: "topo-vector" });
          const graphicsLayer = new GraphicsLayer();
          map.add(graphicsLayer);

          const layers = {
            community: new FeatureLayer({
              url: "https://services6.arcgis.com/3R3y1KXaPJ9BFnsU/arcgis/rest/services/Location_Map_WGS_1984/FeatureServer/4",
              outFields: ["*"],
              visible: true,
              minScale: 300000,
              maxScale: 0
            }),
            parish: new FeatureLayer({
              url: "https://services6.arcgis.com/3R3y1KXaPJ9BFnsU/arcgis/rest/services/Location_Map_WGS_1984/FeatureServer/10",
              outFields: ["*"],
              visible: true
            }),
            postal: new FeatureLayer({
              url: "https://services6.arcgis.com/3R3y1KXaPJ9BFnsU/arcgis/rest/services/Location_Map_WGS_1984/FeatureServer/9",
              outFields: ["*"],
              visible: true,
              minScale: 200000,
              maxScale: 0
            }),
            hospital: new FeatureLayer({
              url: "https://services6.arcgis.com/3R3y1KXaPJ9BFnsU/arcgis/rest/services/Location_Map_WGS_1984/FeatureServer/1",
              outFields: ["*"],
              visible: true,
              minScale: 200000,
              maxScale: 0
            }),
            policeStation: new FeatureLayer({
              url: "https://services6.arcgis.com/3R3y1KXaPJ9BFnsU/arcgis/rest/services/Location_Map_WGS_1984/FeatureServer/2",
              outFields: ["*"],
              visible: true,
              minScale: 200000,
              maxScale: 0
            }),
            postalOfficeAgencies: new FeatureLayer({
              url: "https://services6.arcgis.com/3R3y1KXaPJ9BFnsU/arcgis/rest/services/Location_Map_WGS_1984/FeatureServer/3",
              outFields: ["*"],
              visible: true,
              minScale: 200000,
              maxScale: 0
            }),
            school: new FeatureLayer({
              url: "https://services6.arcgis.com/3R3y1KXaPJ9BFnsU/arcgis/rest/services/Location_Map_WGS_1984/FeatureServer/0",
              outFields: ["*"],
              visible: true,
              minScale: 100000,
              maxScale: 0
            }),
            policeDivision: new FeatureLayer({
              url: "https://services6.arcgis.com/3R3y1KXaPJ9BFnsU/arcgis/rest/services/Location_Map_WGS_1984/FeatureServer/5",
              outFields: ["*"],
              visible: true,
              minScale: 100000,
              maxScale: 0
            }),
            road: new FeatureLayer({
              url: "https://services6.arcgis.com/3R3y1KXaPJ9BFnsU/arcgis/rest/services/Location_Map_WGS_1984/FeatureServer/6",
              outFields: ["*"],
              visible: true,
              minScale: 200000,
              maxScale: 0
            }),
            electoralDivision: new FeatureLayer({
              url: "https://services6.arcgis.com/3R3y1KXaPJ9BFnsU/arcgis/rest/services/Location_Map_WGS_1984/FeatureServer/7",
              outFields: ["*"],
              visible: true,
              minScale: 100000,
              maxScale: 0
            })
          };

          map.addMany([
            layers.hospital,
            layers.policeStation,
            layers.postalOfficeAgencies,
            layers.school,
            layers.road,                  
            layers.postal,
            layers.policeDivision,
            layers.electoralDivision,
            layers.community,
            layers.parish
          ]);

          localView = new MapView({
            container: localMapContainer, // Use cached ref
            map: map,
            center: [-76.8, 18.0],
            zoom: 8
          });

          view.current = localView;

          const searchWidget = new Search({ view: view.current });
          view.current.ui.add(searchWidget, { position: "top-right" });

          const locateWidget = new Locate({ view: view.current });
          view.current.ui.add(locateWidget, { position: "top-left" });

          view.current.on("click", async (event) => {
            const { mapPoint } = event;
            graphicsLayer.removeAll();

            const pointGraphic = new Graphic({
              geometry: mapPoint,
              symbol: {
                type: "simple-marker",
                style: "circle",
                color: "red",
                size: "12px",
                outline: {
                  color: [255, 255, 255],
                  width: 1
                }
              }
            });
            graphicsLayer.add(pointGraphic);

            const communityQuery = layers.community.createQuery();
            communityQuery.geometry = mapPoint;
            communityQuery.spatialRelationship = "intersects";
            communityQuery.returnGeometry = false;
            communityQuery.outFields = ["COMM_NAME"];

            const parishQuery = layers.parish.createQuery();
            parishQuery.geometry = mapPoint;
            parishQuery.spatialRelationship = "intersects";
            parishQuery.returnGeometry = false;
            parishQuery.outFields = ["PARISH"];

            const postalQuery = layers.postal.createQuery();
            postalQuery.geometry = mapPoint;
            postalQuery.spatialRelationship = "intersects";
            postalQuery.returnGeometry = false;
            postalQuery.outFields = ["POST_CODES"];

            const [communityResult, parishResult, postalResult] = await Promise.all([
              layers.community.queryFeatures(communityQuery),
              layers.parish.queryFeatures(parishQuery),
              layers.postal.queryFeatures(postalQuery)
            ]);

            const selectedCommunity = communityResult.features[0]?.attributes?.COMM_NAME || "";
            const selectedParish = parishResult.features[0]?.attributes?.PARISH || "";
            const selectedLocality = postalResult.features[0]?.attributes?.POST_CODES || "";

            console.log("Queried Attributes:", {
              COMM_NAME: selectedCommunity,
              PARISH: selectedParish,
              POST_CODES: selectedLocality
            });

            if (typeof onFeatureSelect === "function") {
              onFeatureSelect({
                COMM_NAME: selectedCommunity,
                PARISH: selectedParish,
                POST_CODES: selectedLocality
              });
            }
          });
        }
      )
      .catch((err) => {
        console.error("ArcGIS module load error:", err);
      });

    return () => {
      if (view.current) {
        view.current.destroy();
        view.current = null;
      }
      if (localMapContainer) {
        localMapContainer.innerHTML = "";
      }
    };
  }, [onFeatureSelect]);

  return (
    <div
      ref={mapRef}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }}
    ></div>
  );
};

export default CommunityMap;
