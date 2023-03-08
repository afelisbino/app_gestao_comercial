import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import React from "react";
import { graficoRoscaDataSetsProps } from "../../interfaces/interfaceGraficos";

interface graficoRoscaProps {
  tituloGrafico: string;
  labels: string[];
  datasets: graficoRoscaDataSetsProps[];
}

export function Rosca({ tituloGrafico, labels, datasets }: graficoRoscaProps) {
  ChartJS.register(ArcElement, Tooltip, Legend);

  return (
    <Doughnut
      options={{
        responsive: true,
        plugins: {
          legend: {
            fullSize: true,
            position: "top",
          },
          title: {
            display: true,
            text: tituloGrafico,
          },
        },
      }}
      data={{
        labels: labels,
        datasets: datasets,
      }}
    />
  );
}
