import regeneratorRuntime from "regenerator-runtime";
import getGeoData from './app';
describe("getGeoData", () => {
    let placename = "london";
    let geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
    let geoUsername = "nutcracker2012";
    const api = `${geoNamesURL}${placename}&maxRows=10&username=${geoUsername}`;
    test("if get GeoData", async() => {
        expect(getGeoData).toBeDefined();
    });
});