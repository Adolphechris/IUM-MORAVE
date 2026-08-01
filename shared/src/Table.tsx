import React from 'react'

type Column<T> = {
  key: keyof T | string
  label: string
  render?: (value: unknown, item: T) => React.ReactNode
}

type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string | number
}

export default function Table<T>({ columns, data, keyExtractor }: TableProps<T>) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: 'white',
        border: '1px solid #dce5ed',
        borderRadius: '.7rem',
        overflow: 'hidden'
      }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} style={{
                textAlign: 'left',
                padding: '.75rem 1rem',
                borderBottom: '1px solid #dce5ed',
                color: '#0a689f',
                fontSize: '.8rem',
                fontWeight: 800,
                letterSpacing: '.09em',
                textTransform: 'uppercase'
              }}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)} style={{ borderBottom: '1px solid #f1f3f6' }}>
              {columns.map((column) => {
                const value = column.key === 'key' ? undefined : (item as Record<string, unknown>)[String(column.key)]
                return (
                  <td key={String(column.key)} style={{ padding: '.75rem 1rem', verticalAlign: 'top' }}>
                    {column.render ? column.render(value, item) : String(value ?? '')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
