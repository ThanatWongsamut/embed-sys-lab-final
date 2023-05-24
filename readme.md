# Welcome to our Embeded System Lab Final Project Repository

**Table of Contents**

- [Click here for Website](#website)

- [Click here for NodeMCU](#nodemcu)

- [Click here for STM32](#stm32)

<br>
<br>

# Task lists

- Website

  - ~~Initial nextjs project~~
  - ~~Design website~~
  - ~~Making website layout~~
  - ~~Connect to Firebase~~

- NodeMCU

  - ~~Initial NodeMCU project~~
  - ~~Connect to Wifi~~
  - ~~Connect to Firebase~~
  - Communicate with Firebase
    - ~~Read data~~
    - ~~Write data~~
    - Listening data changing
  - Communicate between STM32
    - Send
    - Recieve
    - Send custom command to NodeMCU
    - Recieve sensor data from STM32

- STM32

  - ~~Initial STM32 project~~
  - ~~Read sensor~~
    - ~~DHT11~~
    - ~~Soil moisture~~
    - ~~LDR~~
  - Communicate between NodeMCU
    - Recieve
    - Send
    - Pack data and send
    - Handle other commands

<br>
<br>

## **Website**

<details>
  <summary>How to open project</summary>

  <br>

  <ol>
  <li>
  Open Terminal or CMD
  <img src="./fig/website/01.png" />
  </li>

  <li>
  Navigate to Website folder in Project folder
  <img src="./fig/website/02.png" />
  </li>

  <li>
  Launch it with VScode or other tools
  <img src="./fig/website/03.png" />
  </li>

  <li>
  Done
  <img src="./fig/website/04.png" />
  </li>
  </ol>

</details>

<br>

<details>
  <summary>How to develop or launch</summary>

  <br>

  <ol>
  <li>
  Open Terminal or CMD
  <img src="./fig/website/01.png" />
  </li>

  <li>
  Navigate to Website folder in Project folder
  <img src="./fig/website/02.png" />
  </li>

  <li>

`yarn`
to install dependencies for the first time
<img src="./fig/website/05.png" />

  </li>

  <li>

`yarn dev`
to start development server
<img src="./fig/website/06.png" />

<img src="./fig/website/07.png" />

  </li>

  <li>

Visit `localhost:3000` in your browser to see the web application
<img src="./fig/website/08.png" />

  </li>
  </ol>
</details>

<br>

<details>
<summary>How to use and how it work</summary>
<br>
In progress....
</details>

<br>
<br>
<br>
<br>

## **NodeMCU**

<details>
  <summary>How to download ArduinoIDE</summary>

  <ol>
  <li>

Go to `https://www.arduino.cc/en/software` and select your OS
<img src="./fig/nodemcu/11.png" />

  </li>

  <li>

Click `Just Download` to download and install
<img src="./fig/nodemcu/12.png" />

  </li>

  <li>
Launch ArduinoIDE application
<img src="./fig/nodemcu/01.png" />

  </li>

  <li>

Open setting or preferences
<img src="./fig/nodemcu/13.png" />

<img src="./fig/nodemcu/14.png" />

  </li>

  <li>

Add `http://arduino.esp8266.com/stable/package_esp8266com_index.json` in Additional Boards Manager URLs, then click `OK`
<img src="./fig/nodemcu/15.png" />

  </li>

  <li>

Click `Board Manager`
<img src="./fig/nodemcu/16.png" />

  </li>

  <li>

Search for `esp8266` and click `INSTALL`
<img src="./fig/nodemcu/17.png" />
<img src="./fig/nodemcu/18.png" />

  </li>

  <li>

Now you can see `esp8266` in board menu
<img src="./fig/nodemcu/19.png" />

  </li>

  </ol>

</details>

<br>

<details>
  <summary>How to open project</summary>
  
  <br>

  <ol>
  <li>
  Launch ArduinoIDE application
  <img src="./fig/nodemcu/01.png" />
  </li>

  <li>
  Click File > Open
  <img src="./fig/nodemcu/02.png" />
  </li>

  <li>
  Navigate to nodemcu.ino in our project directory
  <img src="./fig/nodemcu/03.png" />
  </li>

  <li>
  Click open and done
  <img src="./fig/nodemcu/04.png" />
  </li>
  <ol>

</details>

<br>

<details>
  <summary>How to upload code to board</summary>
  
  <br>

  <ol>
  <li>
  Launch ArduinoIDE application
  <img src="./fig/nodemcu/01.png" />
  </li>

  <li>
  Click File > Open
  <img src="./fig/nodemcu/02.png" />
  </li>

  <li>
  Navigate to nodemcu.ino in our project directory
  <img src="./fig/nodemcu/03.png" />
  </li>

  <li>
  Click open
  <img src="./fig/nodemcu/04.png" />
  </li>

  <li>

Click `Select Board` and choose your device port
<img src="./fig/nodemcu/05.png" />

  </li>

  <li>

Set Board to `Generic ESP8266 Module` for your device and click `OK`
<img src="./fig/nodemcu/06.png" />

  </li>

  <li>
  Click check button to compile the code
  <img src="./fig/nodemcu/07.png" />
  </li>

  <li>
  Click arrow button to upload code to your device and done
  <img src="./fig/nodemcu/08.png" />
  </li>
  <ol>

</details>

<br>
<br>
<br>
<br>

## **STM32**

<details>
  <summary>How to open project</summary>

  <br>
  
  <ol>

  <li>

Launch STM32CubeIDE and set workspace to our project directory the click to create `Launch`
<img src="./fig/STM32/01.png" />
<img src="./fig/STM32/02.png" />

  </li>

  <li>

Click File > Open Projects from File System...
<img src="./fig/STM32/03.png" />

  </li>

  <li>

Click `Directory...`
<img src="./fig/STM32/04.png" />

  </li>

  <li>

Select STM32 folder in your project directory
<img src="./fig/STM32/05.png" />

  </li>

  <li>

Click `Finish`
<img src="./fig/STM32/06.png" />

  </li>

  <li>

Done
<img src="./fig/STM32/07.png" />

  </li>

  </ol>
</details>
