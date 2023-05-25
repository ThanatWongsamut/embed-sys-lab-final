import Head from 'next/head'
import Image from 'next/image'
import WaterPlant from 'asset/watering-plants.png'
import Plant from 'asset/plant.png'

import React, { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, set, off} from 'firebase/database'
import { toast } from 'react-toastify'


export default function Home() {
  const [date,setDate] = useState<String>('Loading...')
  const [time,setTime] = useState<String>('')
  const [soilMois,setSoilMois] = useState<number>()
  const [airHu,setAirHu] = useState<number>()
  const [disSoilMois,setDisSoilMois] = useState<number>(440)
  const [disAirHu,setDisAirHu] = useState<number>(440)
  const [temperature,setTemperature] = useState<String>()
  const [sunlight,setSunlight] = useState<number>()
  const [status,setStatus] = useState<number>(0)

  const handleButtonClick = () =>{
    const today = new Date()
    const database = getDatabase(app)
    var status:number = 0

    // toast.info("Watering, Please wait",{
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: false,
    //   pauseOnHover: false,
    //   draggable: true,
    //   progress: undefined,
    //   theme: "colored",
    //   pauseOnFocusLoss: false,
    //   icon: "💧"  
    // });

    const Ref = ref(database, 'status')
    onValue(Ref, (snapshot) => {
      const data = snapshot.val()
      status = data
});
    if(status === 0){
      setStatus(1)
      set(ref(database, 'last_watering'), {
      timestamp: today.getTime(),
      });
      set(ref(database, 'status'), 1);
      const resolveAfter15Sec = new Promise(resolve => setTimeout(resolve, 15000));
      toast.promise(
        resolveAfter15Sec,
          {
            pending: 'Watering, Please wait',
            success: {render(){return 'Watering successful'}, 
              theme:'colored',
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              pauseOnFocusLoss: false,
            },
            // error: 'Somethings went wrong'
          }
      )
    }
  }

  const firebaseConfig = {
  apiKey: 'AIzaSyDmmTgCG8ErkDR6sHFjdtGe8XjtjwpqiQc',
  authDomain: 'embed-sys-lab-final.firebaseapp.com',
  databaseURL:
    'https://embed-sys-lab-final-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'embed-sys-lab-final',
  storageBucket: 'embed-sys-lab-final.appspot.com',
  messagingSenderId: '948693157551',
  appId: '1:948693157551:web:e405df4ed86a588fa4765a',
}

  const app = initializeApp(firebaseConfig)

  useEffect(() => {
    const database = getDatabase(app)
    const Ref = ref(database, 'sensor')
    const unsub1 = onValue(Ref, (snapshot) => {
      const data = snapshot.val()
      console.log(data)
      setSunlight(parseInt(data.light))
      setTemperature(data.air_temp.toFixed(1))
      setSoilMois(data.soil_humid > 1 ? 1 : data.soil_humid)
      setAirHu(data.air_humid > 1 ? 1 : data.air_humid)
      setDisSoilMois(data.soil_humid > 1 ? 0 : 440 * (1 - data.soil_humid))
      setDisAirHu(data.air_humid > 1 ? 0 : 440 * (1 - data.air_humid))
});
    const Ref2 = ref(database, 'last_watering')
    const unsub2 = onValue(Ref2, (snapshot) => {
      const data = snapshot.val()
      const today = new Date(data.timestamp)
      const day = `${today.getDate() < 10 ? "0" : ""}${today.getDate()}` 
      const month = `${today.getMonth() + 1 < 10 ? "0" : ""}${today.getMonth() + 1}` 
      const year = today.getFullYear()
      const hour = `${today.getHours() < 10 ? "0" : ""}${today.getHours()}` 
      const minute = `${today.getMinutes() < 10 ? "0" : ""}${today.getMinutes()}` 
      setDate(day + "/" + month + "/" + year)
      setTime(hour + ":" + minute)
});
    return () => {
      unsub1()
      unsub2()
    }
  }, [])

  return (
    <>
      <Head>
        <title>Final Project</title>
        <link rel="icon" href="/plant.ico" />
      </Head>
      <main>
        <div className="flex flex-col md:px-16 justify-center items-center font-sukhumvit">
          <div className="flex flex-row text-5xl lg:text-6xl font-extrabold mb-12 w-full h-32 text-center bg-green-500 rounded-b-3xl md:rounded-b-full justify-center items-center">
            <Image src={Plant} alt={''} className='w-12 hidden md:block mx-4'/>
          Water your Plants
            <Image src={Plant} alt={''} className='w-12 hidden md:block mx-4'/>
          </div>
          <div className='mb-12'>
            <div className='flex flex-col justify-center items-center'>
              <button id='water-button'
                className='w-36 border rounded-full p-4 
                bg-white transition-all ease-in-out duration-150 hover:bg-zinc-200 hover:border-green-400 hover:border-4 mb-4 stroke-transparent' onClick={handleButtonClick}>
                
                <Image src={WaterPlant} alt={''}/>
              </button>
              <div className='flex font-bold text-stone-500'>Last Watering:<div className='font-normal'>&nbsp; {time} {date}</div></div>
            </div>
          </div>
          <div className='flex flex-col lg:flex-row justify-center items-center rounded-3xl bg-zinc-100 p-10 w-full md:w-auto'>
            <div className='flex flex-col md:flex-row justify-center items-center mb-4 md:mb-10 lg:mb-0'>
              <div className='relative md:mr-20 mb-4 md:mb-0'>
                <div className='rounded-full w-40 h-40 p-5'
                style={{boxShadow: '6px 6px 10px -1px rgba(0,0,0,0.15)'}}>
                  <div className='rounded-full w-[120px] h-[120px]'
                  style={{boxShadow: 'inset 4px 4px 6px -1px rgba(0,0,0,0.2),inset -4px -4px 6px -1px rgba(255,255,255,0.7), -0.5px -0.5px 0px rgba(255,255,255,1), 0.5px 0.5px 0px rgba(0,0,0,0.15), 0px 12px 10px -10px rgba(0,0,0,0.05)'}}>
                    <div className='text-center pt-2 m-0 font-bold text-md'>Soil</div>
                    <div className='text-center m-0 font-bold text-md'>Moisture</div>
                    <div className='text-center font-extrabold text-4xl text-[#936f48]'>{soilMois ? String((soilMois * 100).toFixed(1)) + '%' : soilMois === 0 ? '0.0%' : ''}</div>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px" className='absolute top-0 left-0'>
                  <defs>
                    <linearGradient id="GradientColor1">
                      <stop offset="0%" stopColor="#936f48" />
                      <stop offset="100%" stopColor="#ead66b" />
                    </linearGradient>
                  </defs>
                  <circle cx="80" cy="80" r="70" strokeLinecap="round" className="fill-none stroke-white stroke-[20px] "></circle>
                  <circle cx="80" cy="80" r="70" strokeLinecap="round" className='fill-none stroke-[url(#GradientColor1)] stroke-[20px] transition-all ease-in-out duration-1000'
                  style={{strokeDasharray:440,strokeDashoffset:`${disSoilMois}`}}/>
                </svg>
              </div>
              
              <div className='relative lg:mr-20'>
                <div className='rounded-full w-40 h-40 p-5'
                style={{boxShadow: '6px 6px 10px -1px rgba(0,0,0,0.15)'}}>
                  <div className='rounded-full w-[120px] h-[120px]'
                  style={{boxShadow: 'inset 4px 4px 6px -1px rgba(0,0,0,0.2),inset -4px -4px 6px -1px rgba(255,255,255,0.7), -0.5px -0.5px 0px rgba(255,255,255,1), 0.5px 0.5px 0px rgba(0,0,0,0.15), 0px 12px 10px -10px rgba(0,0,0,0.05)'}}>
                    <div className='text-center pt-2 m-0 font-bold text-md'>Air</div>
                    <div className='text-center m-0 font-bold text-md'>Humidity</div>
                    <div className='text-center font-extrabold text-4xl text-[#002473]'>{airHu ? String((airHu * 100).toFixed(1)) + '%' : airHu === 0 ? '0.0%' : ''}</div>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px" className='absolute top-0 left-0'>
                  <defs>
                    <linearGradient id="GradientColor2">
                      <stop offset="0%" stopColor="#002473" />
                      <stop offset="100%" stopColor="#006abc" />
                    </linearGradient>
                  </defs>
                  <circle cx="80" cy="80" r="70" strokeLinecap="round" className="fill-none stroke-white stroke-[20px] "></circle>
                  <circle cx="80" cy="80" r="70" strokeLinecap="round" className='fill-none stroke-[url(#GradientColor2)] stroke-[20px] transition-all ease-in-out duration-1000'
                  style={{strokeDasharray:440,strokeDashoffset:`${disAirHu}`}}/>
                </svg>
              </div>

            </div>
            <div className='flex flex-col md:flex-row justify-center items-center'>
              <div className='md:mr-20 mb-4 md:mb-0'>
                <div className='w-40 h-40 bg-white rounded-full justify-center items-center pt-10' style={{boxShadow: '6px 6px 10px -1px rgba(0,0,0,0.15)'}}>
                  {/* <Image src={Tempearture} alt={''} className ='w-10 mx-auto'></Image> */}
                  <div className='text-center font-bold text-lg'>Temperature</div>
                  <div className={`text-center font-extrabold text-5xl transition-all ease-in-out duration-1000 ${temperature? +temperature < 25 ? 'text-[#006abc]':+temperature > 32 ? +temperature > 40 ? 'text-red-500': 'text-orange-500' :'text-green-500' : 'text-green-500'}`}>{temperature ? temperature + '°C':''}</div>
                </div>
              </div>
              <div className=''>
                <div className='w-40 h-40 bg-white  rounded-full justify-center items-center pt-5 ' style={{boxShadow: '6px 6px 10px -1px rgba(0,0,0,0.15)'}}>
                  {/* <Image src={Sun} alt={''} className='w-10 mx-auto'></Image> */}
                  <div className='text-center font-bold text-lg'>Sun light</div>
                  <div className='text-center font-extrabold text-5xl text-red-500'>{sunlight ? sunlight  : '0'}</div>
                  <div className='text-center font-bold text-5xl text-red-500'>lux</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
