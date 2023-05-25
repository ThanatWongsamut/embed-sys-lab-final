#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include "time.h"
#include <SoftwareSerial.h>

#include "WifiCredential.h"
#include "FirebaseCredential.h"

//Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Database path
String airHumidPath = "/sensor/air_humid";
String airTempPath = "/sensor/air_temp";
String lightPath = "/sensor/light";
String soilHumidPath = "/sensor/soil_humid";
String timestampPath = "/sensor/timestamp";

// Counter
FirebaseJson json;

unsigned long sendDataPrevMillis = 0;
unsigned long timerDelay = 15000;

int airHumid;
int airTemp;
int light;
int soilHumid;
int timestamp;

const char* ntpServer = "pool.ntp.org";

SoftwareSerial comm(5, 6);

unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return(0);
  }
  time(&now);
  return now;
}

void initialWifi() {
  // Connect wifi with ssid and password
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting...  ");  
    Serial.printf("Connection Status: %d\n", WiFi.status()); 
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

void setup()
{
  // Start USB serial
  Serial.begin(9600);
  // Start communicate with STM32
  comm.begin(115200);


  initialWifi();
  initialTime();
  initialFirebase();
}

void loop()
{
  char buffer[80];
  if(comm.available()) {
    comm.readBytesUntil('\n', buffer, 80);
    Serial.println(buffer)
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
}