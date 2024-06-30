const weatherBlock = document.querySelector("#weather");
const currentTimeElement = document.querySelector("#current-time");
const currentDateElement = document.querySelector("#current-date");
const currentMonthElement = document.querySelector("#current-month");
const currentHumidityElement = document.querySelector("#current-humidity");
const refreshButton = document.querySelector("#refresh-btn");

async function loadWeather() {
  const weatherServer =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=Dortmund,de&appid=78b6736689422855d6d2036f112da11f";

  try {
    const response = await fetch(weatherServer);
    if (!response.ok) {
      throw new Error(`Помилка HTTP! Статус: ${response.status}`);
    }

    const weatherData = await response.json();
    updateWeather(weatherData);
    updateWeatherIcon(weatherData.weather[0].icon);
    updateHumidity(weatherData);
  } catch (error) {
    console.error("Помилка отримання даних погоди:", error);
  }
}

function updateWeather(data) {
  const location = data.name;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);

  const weatherTemplate = `<div class="weather_header">
      <div class="weather_main">
        <div class="weather_city">${location}</div>
      </div>
    </div>
    <div class="weather_temp">${temp}°C</div>
    <div class="weather_feels-like">Відчувається як: ${feelsLike}°C</div>`;

  weatherBlock.innerHTML = weatherTemplate;
}

function updateTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  const lastSundayOfMarch = getLastSundayOfMarch(now.getFullYear());
  const lastSundayOfOctober = getLastSundayOfOctober(now.getFullYear());
  const today = now.getDate();

  if (
    (now.getMonth() > 2 && now.getMonth() < 9) ||
    (now.getMonth() === 2 && today >= lastSundayOfMarch) ||
    (now.getMonth() === 9 && today < lastSundayOfOctober)
  ) {
    hours += 0;
  } else {
    hours += 1;
  }

  hours = hours.toString().padStart(2, "0");
  currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

function getLastSundayOfMarch(year) {
  const march = new Date(year, 2, 31);
  while (march.getDay() !== 0) {
    march.setDate(march.getDate() - 1);
  }
  return march.getDate();
}

function getLastSundayOfOctober(year) {
  const october = new Date(year, 9, 31);
  while (october.getDay() !== 0) {
    october.setDate(october.getDate() - 1);
  }
  return october.getDate();
}

function updateDate() {
  const now = new Date();
  const date = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const months = [
    "січня",
    "лютого",
    "березня",
    "квітня",
    "травня",
    "червень",
    "липень",
    "серпень",
    "вересень",
    "жовтень",
    "листопад",
    "грудень",
  ];
  currentDateElement.textContent = `Дата: ${date}`;
  currentMonthElement.textContent = `Місяць: ${months[now.getMonth()]}`;
}

function updateHumidity(data) {
  const humidity = data.main.humidity;
  currentHumidityElement.textContent = `Вологість: ${humidity}%`;
}

function updateWeatherIcon(iconCode) {
  const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
  const weatherIconImg = document.createElement("img");
  weatherIconImg.src = iconUrl;
  weatherIconImg.alt = "Weather Icon";
  weatherBlock.querySelector(".weather_header").appendChild(weatherIconImg);
}

async function initializeWeather() {
  try {
    await loadWeather();
    updateTime();
    updateDate();
  } catch (error) {
    console.error("Помилка при ініціалізації погоди:", error);
  }
}

refreshButton.addEventListener("click", async () => {
  try {
    await loadWeather();
  } catch (error) {
    console.error("Помилка під час оновлення погоди:", error);
  }
});

setInterval(() => {
  updateTime();
  updateDate();
}, 1000);

initializeWeather();
