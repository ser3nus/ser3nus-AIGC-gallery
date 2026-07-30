export default function ParamTable({ params }: { params: Record<string, unknown> }) {
  const entries = Object.entries(params)
  if (entries.length === 0) return null

  return (
    <div className="bg-white rounded-lg border border-warm-200 overflow-hidden">
      <h3 className="font-serif text-lg text-warm-800 px-6 pt-4 pb-2">生成参数</h3>
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key} className="border-t border-warm-100">
              <td className="px-6 py-2 text-warm-400 font-mono text-xs">{key}</td>
              <td className="px-6 py-2 text-warm-700">{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
