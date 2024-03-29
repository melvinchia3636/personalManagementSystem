/* eslint-disable operator-linebreak */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect } from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import { Icon } from '@iconify/react/dist/iconify.js'
import useFetch from '../../hooks/useFetch'
import APIComponentWithFallback from '../../components/general/APIComponentWithFallback'
import ModuleWrapper from '../../components/general/ModuleWrapper'
import GaugeComponent from 'react-gauge-component'
import moment from 'moment'

function formatBytes(bytes: number, decimals = 2): string {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function camelCaseToTitleCase(text: string): string {
  return text.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

// Generated by https://quicktype.io

export interface IDiskUsage {
  name: string
  size: string
  used: string
  avail: string
  usedPercent: string
}

export interface IMemoryUsage {
  total: number
  free: number
  used: number
  percent: number
}

export interface ICPUUSage {
  usage: number
  uptime: number
}

export interface ISystemInfo {
  osInfo: OSInfo
  cpu: CPU
  mem: Record<string, number>
  networkInterfaces: NetworkInterface[]
  networkStats: NetworkStat[]
}

export interface CPU {
  manufacturer: string
  brand: string
  vendor: string
  family: string
  model: string
  stepping: string
  revision: string
  voltage: string
  speed: number
  speedMin: number
  speedMax: number
  governor: string
  cores: number
  physicalCores: number
  performanceCores: number
  efficiencyCores: number
  processors: number
  socket: string
  flags: string
  virtualization: boolean
  cache: Cache
}

export interface Cache {
  l1d: number
  l1i: number
  l2: number
  l3: string
}

export enum LocalAddress {
  Empty = '::',
  The0000 = '0.0.0.0',
  The127001 = '127.0.0.1',
  The1921680117 = '192.168.0.117',
  The2001E68543379C7 = '2001:e68:5433:79c7:'
}

export enum Process {
  Code31C37Ee = 'code-31c37ee',
  Empty = '.',
  Node = 'node',
  Process = ''
}

export enum Protocol {
  TCP = 'tcp',
  Tcp6 = 'tcp6',
  UDP = 'udp'
}

export enum State {
  Established = 'ESTABLISHED',
  Listen = 'LISTEN',
  TimeWait = 'TIME_WAIT'
}

export interface NetworkInterface {
  iface: string
  ifaceName: string
  default: boolean
  ip4: LocalAddress
  ip4subnet: string
  ip6: string
  ip6subnet: string
  mac: string
  internal: boolean
  virtual: boolean
  operstate: string
  type: string
  duplex: string
  mtu: number
  speed: number | null
  dhcp: boolean
  dnsSuffix: string
  ieee8021xAuth: string
  ieee8021xState: string
  carrierChanges: number
}

export interface NetworkStat {
  iface: string
  operstate: string
  rx_bytes: number
  rx_dropped: number
  rx_errors: number
  tx_bytes: number
  tx_dropped: number
  tx_errors: number
  rx_sec: number
  tx_sec: number
  ms: number
}

export interface OSInfo {
  platform: string
  distro: string
  release: string
  codename: string
  kernel: string
  arch: string
  hostname: string
  fqdn: string
  codepage: string
  logofile: string
  serial: string
  build: string
  servicepack: string
  uefi: boolean
}

// Generated by https://quicktype.io

export interface ICPUTemp {
  main: number
  cores: any[]
  max: number
  socket: any[]
  chipset: null
}

function ServerStatus(): React.ReactElement {
  const [diskUsage] = useFetch<IDiskUsage[]>('server/disks')
  const [memoryUsage, refreshMemoryUsage] = useFetch<IMemoryUsage>(
    'server/memory',
    true,
    'GET',
    false,
    false
  )
  const [cpuUsage, refreshCPUUsage] = useFetch<ICPUUSage>(
    'server/cpu',
    true,
    'GET',
    false,
    false
  )
  const [systemInfo] = useFetch<ISystemInfo>('server/info')
  const [cpuTemp] = useFetch<ICPUTemp>(
    'server/cpu-temp',
    true,
    'GET',
    false,
    false
  )

  useEffect(() => {
    const interval = setInterval(() => {
      refreshMemoryUsage()
    }, 1000)
    const interval2 = setInterval(() => {
      refreshCPUUsage()
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(interval2)
    }
  })

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Server Status"
        desc="Monitor the server status to ensure everything is running smoothly."
      />
      <div className="mt-16 flex w-full flex-col gap-6">
        <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="tabler:device-desktop-analytics" className="text-3xl" />
          <span className="ml-2">System Status</span>
        </h1>
        <div className="grid gap-6 lg:grid-cols-3">
          <APIComponentWithFallback data={cpuUsage}>
            {typeof cpuUsage !== 'string' && (
              <div className="flex flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon="tabler:cpu" className="text-2xl text-bg-500" />
                    <h2 className="text-xl text-bg-500">CPU Usage</h2>
                  </div>
                </div>
                <GaugeComponent value={cpuUsage.usage} />
                <p className="text-center text-lg text-bg-500">
                  {moment(cpuUsage.uptime * 1000).format(
                    'D [days], H [hrs], m [mins]'
                  )}{' '}
                  uptime
                </p>
              </div>
            )}
          </APIComponentWithFallback>
          <APIComponentWithFallback data={memoryUsage}>
            {typeof memoryUsage !== 'string' && (
              <div className="flex flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="gg:smartphone-ram"
                      className="text-2xl text-bg-500"
                    />
                    <h2 className="text-xl text-bg-500">Memory Usage</h2>
                  </div>
                </div>
                <GaugeComponent value={memoryUsage.percent} />
                <p className="text-center text-lg text-bg-500">
                  {formatBytes(memoryUsage.used)} /{' '}
                  {formatBytes(memoryUsage.total)} used
                </p>
              </div>
            )}
          </APIComponentWithFallback>
          <APIComponentWithFallback data={cpuTemp}>
            {typeof cpuTemp !== 'string' && (
              <div className="flex flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="tabler:thermometer"
                      className="text-2xl text-bg-500"
                    />
                    <h2 className="text-xl text-bg-500">CPU Temperature</h2>
                  </div>
                </div>
                <GaugeComponent
                  value={cpuTemp.main}
                  labels={{
                    valueLabel: { formatTextValue: value => value + '°C' },
                    tickLabels: {
                      type: 'outer',
                      defaultTickValueConfig: {
                        formatTextValue: (value: string) => value + '°C'
                      }
                    }
                  }}
                  arc={{
                    width: 0.2,
                    padding: 0.005,
                    cornerRadius: 1,
                    // gradient: true,
                    subArcs: [
                      {
                        limit: 65,
                        color: '#5BE12C',
                        showTick: true,
                        tooltip: {
                          text: 'OK temperature!'
                        }
                      },
                      {
                        limit: 80,
                        color: '#F5CD19',
                        showTick: true,
                        tooltip: {
                          text: 'High temperature!'
                        }
                      },
                      {
                        limit: 100,
                        color: '#EA4228',
                        showTick: true,
                        tooltip: {
                          text: 'Too high temperature!'
                        }
                      }
                    ]
                  }}
                />
                <p className="text-center text-lg text-bg-500">
                  {cpuTemp.max}°C max
                </p>
              </div>
            )}
          </APIComponentWithFallback>
        </div>
      </div>
      <div className="mt-16 flex w-full flex-col gap-6">
        <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="tabler:chart-pie" className="text-3xl" />
          <span className="ml-2">Disks Usage</span>
        </h1>
        <APIComponentWithFallback data={diskUsage}>
          {typeof diskUsage !== 'string' && (
            <div className="grid gap-6 lg:grid-cols-2">
              {diskUsage.map(disk => (
                <div
                  key={disk.name}
                  className="flex flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900"
                >
                  <div className="flex w-full min-w-0 items-center justify-between">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <Icon
                        icon="streamline:hard-disk"
                        className="text-2xl text-bg-500"
                      />
                      <h2 className="mr-8 min-w-0 truncate text-xl text-bg-500">
                        {disk.name}
                      </h2>
                    </div>
                    <p className="shrink-0 rounded-md border border-bg-400 px-4 py-2 text-lg text-bg-500">
                      {disk.size}B
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-bg-500">Used</p>
                    <p className="text-lg text-bg-500">{disk.used}B</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-bg-500">Available</p>
                    <p className="text-lg text-bg-500">{disk.avail}B</p>
                  </div>
                  <div className="mt-4 h-3 w-full overflow-hidden rounded-full border border-bg-500">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: disk.usedPercent }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </APIComponentWithFallback>
      </div>
      <div className="mb-12 mt-16 flex w-full flex-col gap-6">
        <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="tabler:info-circle" className="text-3xl" />
          <span className="ml-2">System Information</span>
        </h1>
        <APIComponentWithFallback data={systemInfo}>
          {typeof systemInfo !== 'string' &&
            Object.entries(systemInfo).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900"
              >
                <h2 className="text-xl text-bg-500">
                  {key === 'mem' ? 'Memory' : camelCaseToTitleCase(key)}
                </h2>
                {!Array.isArray(value) ? (
                  <ul className="flex flex-col divide-y divide-bg-700">
                    {Object.entries(value).map(([k, v]) => (
                      <li key={k} className="flex justify-between p-4">
                        <span className="text-lg text-bg-500">
                          {camelCaseToTitleCase(k)}
                        </span>
                        <span className="w-1/2 break-all text-lg text-bg-500">
                          {typeof v === 'object' ? (
                            <ul className="flex flex-col divide-y divide-bg-700">
                              {/* @ts-expect-error - uhh lazy to fix for now =) */}
                              {Object.entries(v).map(([k, v]) => (
                                <li
                                  key={k}
                                  className="flex justify-between p-4"
                                >
                                  <span className="text-lg text-bg-500">
                                    {camelCaseToTitleCase(k)}
                                  </span>
                                  <span className="text-lg text-bg-500">
                                    {/* @ts-expect-error - uhh lazy to fix for now =) */}
                                    {formatBytes(v) || 'N/A'}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : key === 'mem' ? (
                            // @ts-expect-error - uhh lazy to fix for now =)
                            formatBytes(v)
                          ) : (
                            String(v) || 'N/A'
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  value.map((v, i) => (
                    <ul
                      key={i}
                      className="flex flex-col divide-y divide-bg-700"
                    >
                      {Object.entries(v).map(([k, v]) => (
                        <li key={k} className="flex justify-between p-4">
                          <span className="text-lg text-bg-500">
                            {camelCaseToTitleCase(k)}
                          </span>
                          <span className="w-1/2 break-all text-lg text-bg-500">
                            {k.includes('byte')
                              ? // @ts-expect-error - uhh lazy to fix for now =)
                                formatBytes(v)
                              : String(v) || 'N/A'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ))
                )}
              </div>
            ))}
        </APIComponentWithFallback>
      </div>
    </ModuleWrapper>
  )
}

export default ServerStatus
