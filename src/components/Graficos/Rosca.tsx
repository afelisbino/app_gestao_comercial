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

  const plugin = {
    id: 'emptyDoughnut',
    afterDraw(chart, args, options) {
      const { datasets } = chart.data
      const { color, width, radiusDecrease } = options
      let hasData: boolean = false

      for (let i = 0; i < datasets.length; i += 1) {
        const dataset = datasets[i]
        hasData = dataset.data.length > 0
      }

      if (!hasData) {
        const {
          chartArea: { left, top, right, bottom },
          ctx,
        } = chart
        const centerX = (left + right) / 2
        const centerY = (top + bottom) / 2
        const r = Math.min(right - left, bottom - top) / 2

        ctx.beginPath()
        ctx.lineWidth = width || 2
        ctx.strokeStyle = color || 'rgba(255, 128, 0, 0.5)'
        ctx.arc(centerX, centerY, r - radiusDecrease || 0, 0, 2 * Math.PI)
        ctx.stroke()
      }
    },
  }

  return (
    <Doughnut
      redraw={true}
      updateMode={'resize'}
      options={{
        maintainAspectRatio: true,
        resizeDelay: 500,
        responsive: true,
        layout: {
          autoPadding: true,
        },
        plugins: {
          emptyDoughnut: {
            color: 'rgba(105,105,105,0.1)',
            width: 55,
            radiusDecrease: 50,
          },
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
      plugins={[plugin]}
      data={data}
    />
  )
}
