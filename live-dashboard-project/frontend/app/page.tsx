"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LiveChart from "../components/LiveChart";

interface CpuData {
  time: string;
  usage: number;
}
interface LogData {
  id: number;
  message: string;
}

export default function HomePage() {
  const [cpuData, setCpuData] = useState<CpuData[]>([]);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.push("/login");
      return;
    }

    setIsLoading(false);

    const ws = new WebSocket(`ws://localhost:8081/ws?token=${token}`);

    ws.onopen = () => setIsConnected(true);
    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      if (receivedData.cpu) {
        const newCpuData = {
          time: receivedData.cpu.time,
          usage: parseFloat(receivedData.cpu.usage),
        };
        setCpuData((prevData) => [...prevData, newCpuData].slice(-15));
      }
      if (receivedData.log) {
        setLogs((prevLogs) => [receivedData.log, ...prevLogs].slice(0, 10));
      }
    };
    ws.onclose = (event) => {
      setIsConnected(false);
      if (event.code === 1008) {
        localStorage.removeItem("authToken");
        router.push("/login");
      }
    };
    ws.onerror = () => setIsConnected(false);

    return () => ws.close();
  }, [router]);

  if (isLoading) {
    return (
      <main className='flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white'>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className='flex min-h-screen flex-col items-center p-8 bg-gray-900 text-white'>
      <div className='w-full max-w-5xl'>
        <header className='mb-8 flex justify-between items-center'>
          <h1 className='text-4xl font-bold'>Real-time System Monitor</h1>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div
                className={`w-3 h-3 rounded-full transition-colors ${
                  isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              ></div>
              <span>{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("authToken");
                router.push("/login");
              }}
              className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold text-sm transition-colors'
            >
              Logout
            </button>
          </div>
        </header>

        <section className='bg-gray-800 p-6 rounded-lg shadow-lg mb-8'>
          <h2 className='text-2xl font-semibold mb-4'>CPU Usage</h2>
          <LiveChart data={cpuData} />
        </section>

        <section className='bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-2xl font-semibold mb-4'>Event Logs</h2>
          <div className='font-mono text-sm bg-gray-900 p-4 rounded-md h-64 overflow-y-auto'>
            {logs.map((log) => (
              <p
                key={log.id}
                className='whitespace-pre-wrap animate-pulse-once'
              >
                <span className='text-gray-500'>
                  {new Date(log.id).toLocaleTimeString()}:{" "}
                </span>
                <span className='text-green-400'>{log.message}</span>
              </p>
            ))}
            {logs.length === 0 && (
              <p className='text-gray-500'>Waiting for events...</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
