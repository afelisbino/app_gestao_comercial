import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { graficoBarraDataSetsProps } from "../../interfaces/interfaceGraficos";

interface graficoBarrasProps {
  tituloGrafico: string;
  labels: string[];
  datasets: graficoBarraDataSetsProps[];
}

export function Barras({
  tituloGrafico,
  labels,
  datasets,
}: graficoBarrasProps) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: tituloGrafico,
      },
    },
  };

  const dataChart = {
    labels: labels,
    datasets: datasets,
  };

  return <Bar options={options} data={dataChart} />;
}
