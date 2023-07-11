import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { Line } from 'react-chartjs-2'
import { graficoLinhaDataSetsProps } from '../../interfaces/interfaceGraficos'

interface graficoLinhaProps {
  tituloGrafico: string
  labels: string[]
  datasets: graficoLinhaDataSetsProps[]
}

export function Linha({ tituloGrafico, labels, datasets }: graficoLinhaProps) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  )

  const options = {
    maintainAspectRatio: true,
    resizeDelay: 500,
    responsive: true,
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
        font: {
          size: 16,
        },
      },
    },
  }

  const dataChart = {
    labels,
    datasets,
  }

  return (
    <Line
      redraw={true}
      updateMode={'resize'}
      options={options}
      data={dataChart}
    />
  )
}
