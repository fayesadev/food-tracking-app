import React, { useEffect, useState } from "react";
import TrackingIntuitive from "../components/TrackingIntuitive";
import TrackingStandard from "../components/TrackingStandard";
import TrackingPrecise from "../components/TrackingPrecise";
import { FoodToggleDay } from "../components/FoodToggleDay";
import { useModeContext } from "../contexts/mode-status";
import { useStateContext } from "../contexts/ContextProvider";
import { getQualitativeStats } from '../api-requests/tracker';
import { useDateContext } from "../contexts/date-context";
import { Box } from "@mui/system";

import Fade from '@mui/material/Fade';

import Header from '../components/Header';
import { getUserRow } from "../api-requests/dashboard";
import { getDailyMacroStats, getFoodList } from "../api-requests/tracker";
import { format } from 'date-fns';


import {
  getTargetCalories,
  getMaintenanceCalories,
  getTodaysDate,
  getFat,
  getCarbs,
  getProtein
}
  from "../helper-functions/nutritionCalculations";
import FoodList from "../components/FoodList";


const TrackingPage = () => {
  const { mode, setMode } = useModeContext();
  const { selectedContextDate, setSelectedContextDate } = useDateContext();

  const { planet } = useStateContext();
  useEffect(() => { }, [mode]);


  const [mealToggle, setMealToggle] = useState("breakfast");

  const handleToggle = (event, meal) => {
    setMealToggle(meal);
  };


  const [inputs, setUserInputs] = useState({
    id: 1,
    name: "",
    email: "",
    birthdate: "",
    sex: "",
    toggleBF: false,
    mainGoal: "",
    bodyFatPercentage: 0,
    waist: 0,
    hips: 0,
    neck: 0,
    height: 0,
    toggleWCC: false,
    weight_change_goal: 0,
  });

  //date selection functionality for tracker and header
  const [allTimeStats, setAllTimeStats] = useState([]);
  const [dailyStats, setDailyStats] = useState({
    carbs: 0,
    protein: 0,
    fat: 0,
    hungerBefore: 0,
    hungerAfter: 0
  });


  const [dailyMealSummary, setDailyMealSummary] = useState({ 1: [], 2: [], 3: [], 4: [] }) //br, lu, sn, di

  //helper funtions
  const maintenanceCalories = getMaintenanceCalories(inputs.weight, inputs.body_fat_percentage);
  const targetCalories = getTargetCalories(inputs.weight_change_goal, maintenanceCalories);
  const protein = getProtein(inputs.weight, inputs.sex, inputs.body_fat_percentage);
  const fat = getFat(inputs.weight, inputs.sex, inputs.body_fat_percentage);
  const carbs = getCarbs(targetCalories, protein, fat);

  //set user inputs on the tracker
  useEffect(() => {
    getUserRow()
      .then((res) => {
        setUserInputs(res[0]);

      })
      .catch((err) => {
        console.log('getUserRow', err);
      });
  }, [])

  //get data to fill macro cards on standard and precise
  useEffect(() => {
    getDailyMacroStats()
      .then((res) => {
        console.log(55555,res);
        setAllTimeStats(res);
      })
      .catch((err) => {
        console.log('getDailyMacroStats', err)
      });
  }, [selectedContextDate])

console.log(1, allTimeStats)
  
  useEffect(() => {
    let d = 0;
    if (selectedContextDate) {
      d = format(selectedContextDate, "yyyy/MM/dd");

      for (const i of allTimeStats) {
        if (i.date === d) {
          setDailyStats(i); //set stats for dashboard
        }
      }

      getFoodList(d)
        .then((res) => {
          setDailyMealSummary(res);
          console.log('getFoodList',res);
        })
        .catch((err) => {
          console.log('getFoodList', err)
        });
    }
  }, [selectedContextDate, allTimeStats])


  //get the correct qualitative information from the database
  useEffect(() => {
    if (selectedContextDate) {
      const d = format(selectedContextDate, "yyyy/MM/dd")
      console.log('day', typeof(d) )
      getQualitativeStats(d)
        .then((res) => {
          console.log('getQualitativeStats',res)
          // setHungerBefore();
          // setHungerAfter();
          // setMoodArray();
        })
        .catch((err) => {
          console.log('getQualitativeStats', err)
        });
    }
  },[selectedContextDate])


  const props = {
    inputs,
    setUserInputs,
    targetCalories,
    protein,
    carbs,
    fat,
    dailyStats,
    dailyMealSummary,
    setDailyMealSummary,
    mealToggle,
    handleToggle
  }


  return (

    <div>
      <Box
        component="img"
        sx={{
          height: "100%",
          width: "60%",
          position: "absolute",
          top: 0,
          right: "-500px",
          "z-index": "-1",
          opacity: 0.2,
        }}
        src={planet}
      />


      <Header
        dailyStats={dailyStats}
        targetCalories={targetCalories}
        protein={protein}
        carbs={carbs}
        fat={fat}
      >

      </Header>

      {(selectedContextDate && mode === "precise") && <TrackingPrecise {...props} />}
      {(selectedContextDate && mode === "intuitive") && <TrackingIntuitive {...props} />}
      {(selectedContextDate && mode === "standard") && <TrackingStandard {...props} />}




    </div>



  );
};

export default TrackingPage;
