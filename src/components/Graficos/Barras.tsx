import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { Bar } from 'react-chartjs-2'
import { graficoBarraDataSetsProps } from '../../interfaces/interfaceGraficos'

interface graficoBarrasProps {
  tituloGrafico: string
  labels: string[]
  datasets: graficoBarraDataSetsProps[]
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
    Legend,
  )

  const options = {
    maintainAspectRatio: true,
    resizeDelay: 500,
    responsive: true,
    aspectRatio: 2,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: tituloGrafico,
        position: 'top' as const,
        font: {
          size: 16,
        },
      },
    },
    layout: {
      autoPadding: true,
    },
    scales: {
      y: {
        min: 0,
        stacked: false,
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  const dataChart = {
    labels,
    datasets,
  }

  return (
    <Bar
      redraw={true}
      options={options}
      data={dataChart}
      updateMode={'resize'}
    />
  )
}
