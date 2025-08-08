Param(
  [Parameter(Mandatory = $true)]
  [string]$Command,

  [int]$TimeoutSeconds = 60,

  [string]$WorkingDirectory
)

$ErrorActionPreference = 'Stop'

$stdout = [System.IO.Path]::GetTempFileName()
$stderr = [System.IO.Path]::GetTempFileName()

try {
  $pwshPath = (Get-Command pwsh).Source
  if (-not $pwshPath) {
    throw 'pwsh not found on PATH.'
  }

  $startInfo = @{
    FilePath = $pwshPath
    ArgumentList = @('-NoProfile','-NonInteractive','-Command', $Command)
    RedirectStandardOutput = $stdout
    RedirectStandardError  = $stderr
    PassThru = $true
    WindowStyle = 'Hidden'
  }
  if ($WorkingDirectory) { $startInfo.WorkingDirectory = $WorkingDirectory }

  $proc = Start-Process @startInfo

  # Wait with timeout (ms)
  $finished = $proc.WaitForExit($TimeoutSeconds * 1000)
  if (-not $finished) {
    try { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue } catch {}
    Write-Error ("Command timed out after {0}s: {1}" -f $TimeoutSeconds, $Command)
    if (Test-Path $stdout) { Get-Content -Path $stdout -ErrorAction SilentlyContinue }
    if (Test-Path $stderr) { Get-Content -Path $stderr -ErrorAction SilentlyContinue | Write-Error }
    exit 124
  }

  $exitCode = $proc.ExitCode
  if (Test-Path $stdout) { Get-Content -Path $stdout -ErrorAction SilentlyContinue }
  $err = if (Test-Path $stderr) { Get-Content -Path $stderr -ErrorAction SilentlyContinue } else { @() }
  if ($exitCode -ne 0) {
    if ($err) { $err | Write-Error }
    exit $exitCode
  }
  if ($err) { $err | Write-Host }
  exit 0
}
finally {
  Remove-Item $stdout, $stderr -ErrorAction SilentlyContinue
}


