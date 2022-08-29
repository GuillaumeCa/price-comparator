import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import { Chart } from "react-chartjs-2";
import { useQuery } from "react-query";
import {
  CurrentRatesResponse,
  dateToDateKey,
  fetchRatesRange,
} from "../api/exchangerate";
import { ProductWithRates } from "../api/products";
import { ChartBar, QuestionMarkCircle } from "./Icons";

import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const currencySymbols: { [key: string]: string } = {
  EUR: "€",
  USD: "$",
};

function PriceItem(props: {
  price: number;
  currency: string;
  label: string;
  info: string;
  colorStyle?: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-400 text-xs">{props.label}</span>
      <span className="text-xl font-bold leading-tight">
        <span className={props.colorStyle || "text-gray-300"}>
          {props.price}
          {currencySymbols[props.currency]}{" "}
        </span>
        <QuestionMarkCircle title={props.info} />
      </span>
    </div>
  );
}

const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },

  interaction: {
    intersect: false,
    mode: "index",
  },

  scales: {
    x: {
      ticks: {
        color: "#bbb",
      },
    },
    y: {
      ticks: {
        color: "#bbb",
      },
    },
  },
};

const plugins = [
  {
    id: "custom-horizontal-line",
    afterDraw: (chart: any) => {
      if (chart.tooltip?._active?.length) {
        let x = chart.tooltip._active[0].element.x;
        let yAxis = chart.scales.y;
        let ctx = chart.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, yAxis.top);
        ctx.lineTo(x, yAxis.bottom);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#bbb";
        ctx.stroke();
        ctx.restore();
      }
    },
  },
];

function EvolutionGraph({ product }: { product: ProductWithRates }) {
  const { data } = useQuery(["evolution-graph-compare", product.id], () => {
    return fetchRatesRange(
      dateToDateKey(new Date(product.release_date)),
      dateToDateKey(new Date())
    );
  });

  const graphData = useMemo(() => {
    const labels = Object.keys(data?.rates ?? {});
    const rates = Object.values(data?.rates ?? {});
    const computed = rates.map(
      (rate) => product.release_price * rate.EUR * 1.2
    );
    return {
      labels,
      datasets: [
        {
          data: computed,
          borderColor: "#fb7185",
          pointRadius: 0,
          tension: 0.1,
        },
        {
          data: labels.map(() => product.release_price_compare),
          borderColor: "#5eead4",
          pointRadius: 0,
          tension: 0.1,
        },
      ],
    };
  }, [data]);

  const chartRef = useRef();

  function handleMouseMove(event: any) {
    // console.log(event);
  }

  return (
    <div className="mt-4">
      <Chart
        ref={chartRef}
        type="line"
        plugins={plugins}
        options={options}
        data={graphData}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
}

export function ProductCompareRow({
  product: p,
  currentRates,
}: {
  product: ProductWithRates;
  currentRates: CurrentRatesResponse;
}) {
  const [showEvolution, setShowEvolution] = useState(false);

  return (
    <li className="p-4">
      <div className="flex items-center mb-3">
        <h2 className="text-2xl font-medium">{p.name}</h2>
        <p className="ml-3 px-1 rounded text-sm bg-gray-400 text-gray-700">
          Released on {dayjs(p.release_date).format("DD/MM/YYYY")} (
          {dayjs(p.release_date).fromNow()})
        </p>

        <button
          className="ml-auto"
          onClick={() => setShowEvolution(!showEvolution)}
        >
          <ChartBar />
        </button>
      </div>
      <div className="flex flex-wrap justify-between">
        <PriceItem
          label="Release Price $"
          price={p.release_price}
          currency="USD"
          info="The price set at release in $"
        />
        <PriceItem
          label="Release Price € (+tax)"
          price={p.release_price_compare}
          currency="EUR"
          colorStyle="text-teal-300"
          info="The price set at release in €"
        />
        <PriceItem
          label="Price computed at release € (+tax)"
          price={Math.round(p.release_price * p.rates.EUR * 1.2 + p.fixed_tax)}
          currency="EUR"
          info="The price you should have payed at release in €"
        />
        <PriceItem
          label="Current Price € (+tax)"
          price={Math.round(
            p.release_price * currentRates.rates[p.currency_compare] * 1.2 +
              p.fixed_tax
          )}
          colorStyle="text-rose-400"
          currency="EUR"
          info="The price you should pay now in €"
        />
        <PriceItem
          label="Price Diff €"
          price={
            p.release_price_compare -
            Math.round(
              p.release_price * currentRates.rates[p.currency_compare] * 1.2 +
                p.fixed_tax
            )
          }
          currency="EUR"
          info="The difference of price between the release price in € and the price you should pay"
        />
      </div>

      {showEvolution && <EvolutionGraph product={p} />}
    </li>
  );
}
