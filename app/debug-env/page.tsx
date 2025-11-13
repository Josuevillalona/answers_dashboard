export default function DebugEnv() {
  // These will be replaced at build time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Variables Debug</h1>
      <div style={{ marginTop: '20px' }}>
        <h2>NEXT_PUBLIC_SUPABASE_URL:</h2>
        <p style={{ wordBreak: 'break-all' }}>
          {supabaseUrl ? `✅ Set: ${supabaseUrl.substring(0, 30)}...` : '❌ Not set'}
        </p>
        
        <h2>NEXT_PUBLIC_SUPABASE_ANON_KEY:</h2>
        <p style={{ wordBreak: 'break-all' }}>
          {supabaseKey ? `✅ Set: ${supabaseKey.substring(0, 30)}...` : '❌ Not set'}
        </p>

        <div style={{ marginTop: '30px', padding: '15px', background: '#f0f0f0', borderRadius: '5px' }}>
          <h3>Instructions:</h3>
          <ol>
            <li>If both show ❌ Not set, the environment variables are not being picked up from Vercel</li>
            <li>If both show ✅ Set with values, the environment variables are working correctly</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
