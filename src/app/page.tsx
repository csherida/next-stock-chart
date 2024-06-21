import { StockChart } from './components/stockChart';

export default async function Page() {
  return (
    <div className="my-14 flex w-full flex-col items-center px-4">
      <div className=" max-w-3xl w-full gap-4">

        <div className="my-4" />

        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex flex-col gap-2 flex-1">
            <div className="w-full">
              <StockChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// forces the route handler to be dynamic
export const dynamic = 'force-dynamic';
