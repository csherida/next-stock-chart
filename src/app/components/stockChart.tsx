'use client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);
import 'chart.js/auto';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Define the shape of the chart data
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }[];
}

const transformData = (labels: string[], prices: number[]): ChartData => {
  return {
    labels: labels,
    datasets: [
      {
        label: 'Price',
        data: prices,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
    ],
  };
};

export const StockChart: React.FC = ({}) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const [ticker, setTicker] = useState<string>('');
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [previousButton, setPreviousButton] = useState<number | null>(null);

  const buttons = ['1d', '5d', '1m', '6m', '1y']; // Array of strings

  const handleClick = (index: number) => {
    setPreviousButton(selectedButton);
    setSelectedButton(index);
    setLoading(true);
    const timeLength = buttons[index];
    fetch(
      '/api/company/stock-price?ticker=' + ticker + '&time=' + timeLength,
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('received stock data: ' + data);
        const chartData = transformData(data.labels, data.data);
        setData(chartData);
        setLoading(false);
      });
  };

  const getButtonStyle = (index: number) => {
    if (index === selectedButton) {
      return 'graph_selected'; // Style for selected button
    } else if (index === previousButton) {
      return 'graph_unselected'; // Style for previously selected button
    } else {
      return 'graph_unselected'; // Default style for other buttons
    }
  };

  useEffect(() => {
    setSelectedButton(2);
    setTicker('AAPL');
    fetch('/api/company/stock-price?ticker=AAPL&time=1m')
      .then((res) => res.json())
      .then((data) => {
        console.log('received stock data: ' + data);
        const chartData = transformData(data.labels, data.data);
        setData(chartData);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;

  const handleTickerChange = (event: any) => {
    const value = event.target.value;
    setTicker(value);
  };

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center font-semibold text-sm">
        <div className="font-bold text-sm">Stock Performance</div>
        <form>
        <div className="flex font-bold text-sm">
        <input type="text" onChange={handleTickerChange} value={ticker}  maxLength={4} style={{width: "70px"}}      className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        )}/>
             <Button
            onClick={() => handleClick(selectedButton!)}
            variant='graph_selected'
            size="xsm"
          >
            Get Price History
          </Button>
          </div>
      </form>
        
      </div>
      <div className="h-full">
      <div>
      <div className="h-full">
        {data ? (
          <Line
            data={data}
            height={'300%'}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, ticks) {
                      return '$' + value;
                    },
                  },
                },
              },
            }}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="flex" style={{ justifyContent: 'space-between' }}>
        {buttons.map((buttonLabel, index) => (
          <Button
            key={index}
            onClick={() => handleClick(index)}
            variant={getButtonStyle(index)}
            size="xsm"
          >
            {buttonLabel}
          </Button>
        ))}
      </div>
    </div>
      </div>
    </Card>
  );
}
