import React,{useState, useEffect} from 'react';
import {Line} from "react-chartjs-2";
import numeral from 'numeral';

const options={
    legend:{
        display : false,
    },
      elements :{
          point : {
              radius : 0,
          },
      },

      maintainAspectRatio : false,
      tooltips : {

        mode : "index",
        intersect : false,
        callbacks : {
            label :function(tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");

            },
        },
      },
      scales :{
          xAxes :[
              {
                  type : "time",
                  time : {
                      format : "MM/DD/YY",
                      tooltipFormat : "ll",
                  },
              },
          ],
          yAxes : [
              {
                  gridLines : {
                      display : false,
                  },
                  ticks: {
                      callback : function(value , index, values){
                          return numeral(value).format("0a");
                      },
                  },
              },
          ],
      },

}

const buildChartData=(data,casesType='cases')=>{
    const charData=[];
    let lastDatePoint;
    for( let date in data.cases) { 
        if(lastDatePoint)
        {
         const newDatePoint={
             x:date,
             y:data[casesType][date]-lastDatePoint
         }   
         charData.push(newDatePoint);
        }
        lastDatePoint= data[casesType][date];
        
    }

    return charData;
}

function Linegraph({casesType='cases',...props}) {
    const [data,setData]=useState({});
  

    useEffect(() => {
        
        const fetchData= async()=>{
            
          await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then((response)=> response.json())
        .then((data)=> {
            //console.log(data);
            const charData=buildChartData(data,casesType);
            console.log(charData);
            setData(charData);

        });
        };
        fetchData();

    }, [casesType]);

    return (
        <div className={props.className}>
        
            {data?.length>0 && (
                
                <Line 
            options={options}
            data={{
                datasets:[{
                    backgroundColor:"rgba(204,16,52,0.9)",
                    borderColor: "#CC1034",
                    data : data,
                },
             ],
            }}/>
            )}

        </div>
    )
}

export default Linegraph
