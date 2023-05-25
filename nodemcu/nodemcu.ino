#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include "time.h"
#include <SoftwareSerial.h>
#include <string.h>

#include "WifiCredential.h"
#include "FirebaseCredential.h"

//Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Database path
String airTempPath = "/air_temp";
String airHumidPath = "/air_humid";
String soilHumidPath = "/soil_humid";
String lightPath = "/light";
String timestampPath = "/timestamp";

// Counter
FirebaseJson json;

unsigned long sendDataPrevMillis = 0;
unsigned long getDataPrevMillis = 0;
unsigned long timerDelay = 15000;
unsigned long getDelay = 5000;

int airTemp;
float airHumid;
float soilHumid;
float light;
int timestamp;

const char* ntpServer = "pool.ntp.org";

SoftwareSerial comm(D5, D6);

bool waitingData = true;
bool doneWater = true;

void initialUSBSerial() {
  // Start USB serial
}

void initialSTMSerial() {
  // Start communicate with STM32
}

unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return (0);
  }
  time(&now);
  return now;
}

void initialWifi() {
  // Connect wifi with ssid and password
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting...  ");
    // Serial.printf("Connection Status: %d\n", WiFi.status());
    delay(1000);
  }

  // Connected
  Serial.print("Wi-Fi connected.");
  Serial.print("IP Address : ");
  Serial.println(WiFi.localIP());
}

void initialTime() {
  // Start connect timestamp server
  configTime(0, 0, ntpServer);
}

void initialFirebase() {
  // Firebase client version
  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  // Connect Firebase
  config.api_key = FIREBASE_API_KEY;
  config.database_url = FIREBASE_DATABASE_URL;

  // Assign the user sign in credentials
  auth.user.email = FIREBASE_EMAIL;
  auth.user.password = FIREBASE_PASSWORD;

  // Assign the callback function for the long running token generation task
  config.token_status_callback = tokenStatusCallback;

  // Begin with anonymous user
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void setup() {
  Serial.begin(115200);

  comm.begin(9600);
  pinMode(D5, INPUT);
  pinMode(D6, OUTPUT);

  pinMode(D0, OUTPUT);  //blink

  initialWifi();
  initialTime();
  initialFirebase();
}

void loop() {
  if (millis() - sendDataPrevMillis > timerDelay || sendDataPrevMillis == 0) {
    // "1" for reading command to get sensor data
    Serial.println("Receieving Sensor Data");
    comm.write('1');

    if (!waitingData) {
      waitingData = true;
    }

    sendDataPrevMillis = millis();
  }

  if (millis() - getDataPrevMillis > getDelay || getDataPrevMillis == 0) {
    String wateringStatus = Firebase.RTDB.getInt(&fbdo, F("/status")) ? String(fbdo.to<int>()).c_str() : fbdo.errorReason().c_str();
    if (wateringStatus == "1") {
      // "2" for STM32 to start pump
      Serial.println("Start Watering");
      if (doneWater) {
        doneWater = false;
      }

      if (!doneWater) {
        comm.write('2');
      }
    }

    getDataPrevMillis = millis();
  }

  // if (Firebase.ready() && (millis() - sendDataPrevMillis > timerDelay || sendDataPrevMillis == 0)) {
  //   sendDataPrevMillis = millis();

  //   //Get current timestamp
  //   timestamp = getTime();
  //   Serial.print("time: ");
  //   Serial.println(timestamp);

  //   airHumid = rand();
  //   airTemp = rand();
  //   light = rand();
  //   soilHumid = rand();

  //   json.set(airHumidPath.c_str(), String(airHumid));
  //   json.set(airTempPath.c_str(), String(airTemp));
  //   json.set(lightPath.c_str(), String(light));
  //   json.set(soilHumidPath.c_str(), String(soilHumid));
  //   json.set(timestampPath.c_str(), String(timestamp));
  //   Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, "/", &json) ? "ok" : fbdo.errorReason().c_str());
  // }

  if (comm.available()) {
    String prefix = comm.readStringUntil('[');
    // Serial.println(prefix);
    if (prefix == "water") {
      doneWater = true;

      // Set status back to 0
      Firebase.RTDB.setInt(&fbdo, F("/status"), 0);

      Serial.println("Watered");
    }

    String airTempRaw = comm.readStringUntil(',');
    // airTempRaw.remove(0, 1);
    airTempRaw.replace("[", "");
    airTemp = airTempRaw.toInt();

    String airHumidRaw = comm.readStringUntil(',');
    airHumid = (float)(airHumidRaw.toFloat() / 100.0);

    String soilHumidRaw = comm.readStringUntil(',');
    soilHumid = (float)(soilHumidRaw.toFloat() / 100.0);

    String lightRaw = comm.readStringUntil(']');
    // lightRaw.remove(lightRaw.length() - 1, 1);
    lightRaw.replace("]", "");
    light = lightRaw.toFloat();

    if (Firebase.ready() && waitingData) {
      Serial.printf("Air Temp: %d, Air Humid: %.2f, Soil Humid: %.2f, Light: %.2f, ", airTemp, airHumid, soilHumid, light);

      //Get current timestamp
      timestamp = getTime();
      Serial.print("Time: ");
      Serial.println(timestamp);

      json.set(airHumidPath, airHumid);
      json.set(airTempPath, airTemp);
      json.set(lightPath, light);
      json.set(soilHumidPath, soilHumid);
      json.set(timestampPath, timestamp);
      Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, "/sensor", &json) ? "ok" : fbdo.errorReason().c_str());

      waitingData = false;
    }
  }

  digitalWrite(D0, HIGH);
  delay(1000);
  digitalWrite(D0, LOW);
  delay(1000);
}