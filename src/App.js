import React, { useState, useEffect } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import "./App.css";
import InfoBox from "./components/InfoBoxes/InfoBox";
import "./components/InfoBoxes/InfoBox.css";
import Table from "./components/Table/Table";
import { sortData, prettyPrintStat } from "./components/util/util";
import LineGraph from "./components/LineGraph/LineGraph";
import Map from "./components/Map/Map";
import "leaflet/dist/leaflet.css";

function App() {
  const urlCountry = "https://disease.sh/v3/covid-19/countries";
  const urlWorldwide = "https://disease.sh/v3/covid-19/all";

  //STATE = how to write a variable in REACT <<<<<<
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(["Worldwide"]);
  const [countryInfo, setCountryInfo] = useState({}); //empty object because data is set in form of object
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 27.700769, lng: 85.30014 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  //for Worldwide data when the page loads for the first time
  useEffect(() => {
    fetch(urlWorldwide)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  //useEffect = Runs a piece of code based on given conditions <<<<<
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch(urlCountry)
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // Nepal, India, USA, Uk
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data); //passing sorted data to the table
          setTableData(sortedData); //setting data for table country wise
          setMapCountries(data); //fetching countries data for creating circle
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "Worldwide"
        ? urlWorldwide
        : `${urlCountry}/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode); //for updating the input list i.e dropdown
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(3);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl>
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
              className="app__dropdown"
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {/* Loop through all the countries and show a drop down list of the options */}
              {countries.map((country) => (
                <MenuItem value={country.value}> {country.name} </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType==="cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronovirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType==="recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType==="deaths"}
            title="Deaths"
            onClick={(e) => setCasesType("deaths")}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />

          {/* Line Graph */}
            <h3>WorldWide New {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
