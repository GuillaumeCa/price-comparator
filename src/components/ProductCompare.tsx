import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo, useRef, useState } from "react";
import { Chart } from "react-chartjs-2";
import { ProductWithRates } from "../api/products";
import { ChartBar, QuestionMarkCircle } from "./Icons";

dayjs.extend(relativeTime);

import { useQuery } from "@tanstack/react-query";
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { CurrentRatesResponse } from "../api/exchangerate";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
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

const options = {
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
} satisfies ChartOptions<"line">;

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

function getHistoryRates(
  date: string
): Promise<{ date: string; usd: number }[]> {
  return fetch("/api/rates?date=" + date).then((res) => res.json());
}

function EvolutionGraph({
  product,
  currentRate,
}: {
  product: ProductWithRates;
  currentRate: CurrentRatesResponse;
}) {
  const { data: historicRates } = useQuery({
    queryKey: ["rates-history", product.product.release_date],
    queryFn: () => getHistoryRates(product.product.release_date),
  });

  const graphData = useMemo(() => {
    const keyVal: Record<string, number> = {};
    historicRates?.forEach((hr) => {
      keyVal[dayjs(hr.date).format("YYYY-MM-DD")] = hr.usd;
    });

    keyVal[dayjs().format("YYYY-MM-DD")] = currentRate.rates.USD;

    const labels = Object.keys(keyVal);
    const computed = Object.values(keyVal).map(
      (rate) => product.product.release_price * (1 / rate) * 1.2
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
          data: labels.map(() => product.product.release_price_compare),
          borderColor: "#5eead4",
          pointRadius: 0,
          tension: 0.1,
        },
      ],
    } satisfies ChartData<"line", number[], string>;
  }, [
    historicRates,
    product.product.release_price,
    product.product.release_price_compare,
  ]);

  const chartRef = useRef(null);

  return (
    <div className="mt-4">
      <Chart
        ref={chartRef}
        type="line"
        plugins={plugins}
        options={options}
        data={graphData}
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col md:flex-row md:items-center">
          <h2 className="text-2xl font-medium mr-3">{p.product.name}</h2>
          <p className="px-1 mt-1 md:mt-0 rounded text-sm bg-gray-400 text-gray-700">
            Released on {dayjs(p.product.release_date).format("DD/MM/YYYY")} (
            {dayjs(p.product.release_date).fromNow()})
          </p>
        </div>

        <button
          className="p-2"
          onClick={() => setShowEvolution(!showEvolution)}
        >
          <ChartBar />
        </button>
      </div>
      <div className="flex flex-wrap justify-between">
        <PriceItem
          label="Release Price $"
          price={p.product.release_price}
          currency="USD"
          info="The price set at release in $"
        />
        <PriceItem
          label="Release Price € (+tax)"
          price={p.product.release_price_compare}
          currency="EUR"
          colorStyle="text-teal-300"
          info="The price set at release in €"
        />
        <PriceItem
          label="Release Price Computed € (+tax)"
          price={Math.round(
            p.product.release_price * p.rates.EUR * 1.2 + p.product.fixed_tax
          )}
          currency="EUR"
          info="The price you should have payed at release in €"
        />
        <PriceItem
          label="Computed Price Now € (+tax)"
          price={Math.round(
            p.product.release_price * (1 / currentRates.rates["USD"]) * 1.2 +
              p.product.fixed_tax
          )}
          colorStyle="text-rose-400"
          currency="EUR"
          info="The price you should pay now in €"
        />
        <PriceItem
          label="Price Diff €"
          price={
            p.product.release_price_compare -
            Math.round(
              p.product.release_price * (1 / currentRates.rates["USD"]) * 1.2 +
                p.product.fixed_tax
            )
          }
          currency="EUR"
          info="The difference of price between the release price in € and the price you should pay"
        />
      </div>

      {showEvolution && (
        <EvolutionGraph product={p} currentRate={currentRates} />
      )}
    </li>
  );
}
