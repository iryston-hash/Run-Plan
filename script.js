'use strict';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}
class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
  }
}
class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.disatance / (this.duration / 60);
    return this.speed;
  }
}
const run1 = new Running([52, 30], 5, 21, 180);
const cycling1 = new Cycling([52, 30], 5, 21, 222);
console.log(run1, cycling1);

// Arc
class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('could not get your location');
        }
      );
    }
  }
  _loadMap(position) {
    {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      // console.log(latitude, longitude);
      // console.log(`https://www.google.com/maps/@${latitude},${longitude}13z`);

      const coords = [latitude, longitude];
      //💾 Leaflet API
      console.log(this);
      this.#map = L.map('map').setView(coords, 13);
      // console.log(map);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
        this.#map
      );

      this.#map.on('click', this._showForm.bind(this));
    }
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    // helpers
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    //
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const alertInput = alert('Inputs must be positive numbers');

    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, elevation)
      )
        return alertInput;

      // if(!Number.isFinite(distance) ||!Number.isFinite(duration) || !Number.isFinite(cadence)) return alert('Inputs must contain positive Numbers')
    }
    if (type === 'cycling') {
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alertInput;
    }

    // clear fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Location')
      .openPopup();
  }
}

const app = new App();

// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(
//     function (position) {
//       const { latitude } = position.coords;
//       const { longitude } = position.coords;
//       // console.log(latitude, longitude);
//       // console.log(`https://www.google.com/maps/@${latitude},${longitude}13z`);

//       const coords = [latitude, longitude];
//       //💾 Leaflet API
//       map = L.map('map').setView(coords, 13);
//       // console.log(map);
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
//         map
//       );

//       map.on('click', function (mapE) {
//         mapEvent = mapE;
//         form.classList.remove('hidden');
//         inputDistance.focus();
//         console.log(mapEvent);
//         const { lat, lng } = mapEvent.latlng;
//         L.marker([lat, lng])
//           .addTo(map)
//           .bindPopup(
//             L.popup({
//               maxWidth: 250,
//               minWidth: 100,
//               autoClose: false,
//               closeOnClick: false,
//               className: 'running-popup',
//             })
//           )
//           .setPopupContent('Location')
//           .openPopup();
//       });
//     },
//     function () {
//       alert('could not get your location');
//     }
//   );
// }

//   this.#mapEvent = mapE;
//   form.classList.remove('hidden');
//   inputDistance.focus();
//   console.log(mapEvent);
//   const { lat, lng } = mapEvent.latlng;
//   L.marker([lat, lng])
//     .addTo(this.#map)
//     .bindPopup(
//       L.popup({
//         maxWidth: 250,
//         minWidth: 100,
//         autoClose: false,
//         closeOnClick: false,
//         className: 'running-popup',
//       })
//     )
//     .setPopupContent('Location')
//     .openPopup();

// form.addEventListener('submit', function (e) {
//   e.preventDefault();
//   // clear fields
//   inputDistance.value =
//     inputDuration.value =
//     inputCadence.value =
//     inputElevation.value =
//       '';

//   console.log(mapEvent);
//   const { lat, lng } = mapEvent.latlng;
//   L.marker([lat, lng])
//     .addTo(map)
//     .bindPopup(
//       L.popup({
//         maxWidth: 250,
//         minWidth: 100,
//         autoClose: false,
//         closeOnClick: false,
//         className: 'running-popup',
//       })
//     )
//     .setPopupContent('Location')
//     .openPopup();
// });

// inputType.addEventListener('change', function () {
//   inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
//   inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
// });
