import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { graficoRoscaDataSetsProps } from '../../interfaces/interfaceGraficos'

interface graficoRoscaProps {
  tituloGrafico: string
  labels: string[]
  datasets: graficoRoscaDataSetsProps[]
}

export function Rosca({ tituloGrafico, labels, datasets }: graficoRoscaProps) {
  ChartJS.register(ArcElement, Tooltip, Legend)

  const data = {
    labels,
    datasets,
  }

  return (
    <Doughnut
      redraw={true}
      updateMode={'default'}
      options={{
        maintainAspectRatio: true,
        resizeDelay: 500,
        aspectRatio: 1,
        responsive: true,
        layout: {
          autoPadding: true,
        },
        plugins: {
          legend: {
            fullSize: true,
            position: 'right',
          },
          title: {
            display: true,
            align: 'center',
            text: tituloGrafico,
            position: 'top',
            font: {
              size: 16,
            },
          },
        },
      }}
      data={data}
    />
  )
}
