#define D0 16
#define LED D0

void setup()
{
  pinMode(LED,OUTPUT);
}

void loop()
{
  digitalWrite(LED,HIGH);
  delay(250);
  digitalWrite(LED,LOW);
  delay(250);
}