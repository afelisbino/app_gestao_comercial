import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { graficoLinhaDataSetsProps } from "../../interfaces/interfaceGraficos";

interface graficoLinhaProps {
  tituloGrafico: string;
  labels: string[];
  datasets: graficoLinhaDataSetsProps[];
}

export function Linha({ tituloGrafico, labels, datasets }: graficoLinhaProps) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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

  return <Line options={options} data={dataChart} />;
}
