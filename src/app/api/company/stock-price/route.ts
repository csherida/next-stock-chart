import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

type intervalType =
  | '1d'
  | '5d'
  | '1m'
  | '2m'
  | '5m'
  | '15m'
  | '30m'
  | '60m'
  | '90m'
  | '1h'
  | '1wk'
  | '1mo'
  | '3mo'
  | undefined;

interface ChartData {
  labels: string[];
  data: number[];
}

function getLastWeekdayOfWeek(): Date {
  const lastWeekday = new Date();

  switch (lastWeekday.getDay()) {
    case 0:
      lastWeekday.setDate(lastWeekday.getDate() - 3);
      break;
    case 6:
      lastWeekday.setDate(lastWeekday.getDate() - 2);
      break;
    default:
      lastWeekday.setDate(lastWeekday.getDate() - 1);
  }

  return lastWeekday;
}

function determineStartDate(i: string): [Date, intervalType] {
  const startDate = new Date();
  var interval: intervalType;
  switch (i) {
    case '1d':
      startDate.setDate(getLastWeekdayOfWeek().getDate());
      interval = '30m';
      break;
    case '5d':
      startDate.setDate(startDate.getDate() - 6);
      interval = '1d';
      break;
    case '1m':
      startDate.setDate(startDate.getDate() - 31);
      interval = '5d';
      break;
    case '6m':
      startDate.setDate(startDate.getDate() - 183);
      interval = '1mo';
      break;
    case '1y':
      startDate.setDate(startDate.getDate() - 365);
      interval = '1mo';
      break;
  }
  return [startDate, interval];
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const ticker = req.nextUrl.searchParams.get('ticker');
    const timeLength = req.nextUrl.searchParams.get('time');
    console.log('Received request to fetch stoc data for: ' + ticker);

    if (!ticker || !timeLength) {
      return NextResponse.json(
        { error: 'missing ticker or time length' },
        { status: 400 },
      );
    }

    const rawResults = await fetchStockData(ticker!, timeLength);
    const formattedResults = transformData(rawResults, timeLength === '1d');

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.log('error saving contact-us form: ' + error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// Fetch and transform data
const fetchStockData = async (symbol: string, timeLength: string) => {
  try {
    console.log('about to fetch stock data for: ' + symbol);
    const [startDate, interval] = determineStartDate(timeLength);
    const queryOptions = {
      period1: startDate,
      interval: interval,
    };
    const result = await yahooFinance.chart(symbol, queryOptions);
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
};

const transformData = (
  stockData: any,
  timeOnly: boolean = false,
): ChartData => {
  const quotes = stockData.quotes;
  var labels;
  if (timeOnly) {
    labels = quotes.map((quote: any) =>
      new Date(quote.date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
    );
  } else {
    labels = quotes.map((quote: any) =>
      new Date(quote.date).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
      }),
    );
  }
  const data = quotes.map((quote: any) => formatDollars(quote.close));

  return { labels: labels, data: data };
};

export function formatDollars(num: number = 0, decimals: number = 2): string {
  return (Math.round(num * 100) / 100).toFixed(decimals);
}