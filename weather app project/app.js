
let countryName = prompt('Enter your country name.')
let cityName = prompt('Enter your city name.')

async function getLocation() {

    try {
        let res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${countryName}`);
        console.log(res);
        let data = await res.json();
        console.log(data);
    } catch (err) {
        console.log(err)
    }





    // navigator.geolocation.getCurrentPosition(position => {
    //     let lat = position.coords.latitude;
    //     let long = position.coords.longitude;

    //     console.log(lat, '==> lat\n', long, '==>> long')
    //     getWeather(lat, long);

    // }, err => {
    //     console.log(err, '==>> err')
    // })
}
getLocation()


async function getWeather(lat, long) {
    let res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m`);
    console.log(res);
    let resData = await res.json();
    console.log(resData);
}