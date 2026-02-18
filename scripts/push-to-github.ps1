<#
Interactive PowerShell helper to initialize git, create .gitignore, commit and push to GitHub.
Usage: Open PowerShell in project root and run: .\scripts\push-to-github.ps1
#>

function Write-Info($msg){ Write-Host "[INFO] " $msg -ForegroundColor Cyan }
function Write-Warn($msg){ Write-Host "[WARN] " $msg -ForegroundColor Yellow }
function Write-Err($msg){ Write-Host "[ERROR] " $msg -ForegroundColor Red }

# Ensure script runs from repository root (where this script is located)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location "$scriptDir\.." | Out-Null

Write-Info "Directorio actual: $(Get-Location)"

# Check if git is available
try {
    git --version > $null 2>&1
    Write-Info "Git detectado."
} catch {
    Write-Warn "Git no está instalado o no está en PATH."
    $resp = Read-Host "¿Deseas intentar instalar Git via winget? (y/N)"
    if ($resp -eq 'y' -or $resp -eq 'Y'){
        try{
            winget install --id Git.Git -e --source winget
            Write-Info "Intento de instalación completado. Comprueba git --version y vuelve a ejecutar el script si es necesario."
        } catch {
            Write-Err "No se pudo instalar Git automáticamente. Instala Git manualmente desde https://git-scm.com/."
            exit 1
        }
    } else {
        Write-Err "Instala Git manualmente desde https://git-scm.com/ y vuelve a ejecutar este script."
        exit 1
    }
}

# Create .gitignore if not exists
if (-not (Test-Path .gitignore)){
    Write-Info "Creando .gitignore básico"
    @"
node_modules
.env
.env.local
.env.*.local
.DS_Store
dist
build
.vscode
"@ | Out-File -Encoding utf8 .gitignore
}

# Initialize repo if needed
if (-not (Test-Path .git\HEAD)){
    Write-Info "Inicializando repo git..."
    git init
    git branch -M main
} else {
    Write-Info "El repositorio git ya existe."
}

# Stage and commit
Write-Info "Añadiendo archivos y creando commit..."
git add .
$commitMsg = Read-Host "Mensaje de commit (por defecto: 'feat: update project')"
if ([string]::IsNullOrWhiteSpace($commitMsg)) { $commitMsg = 'feat: update project' }
try{
    git commit -m "$commitMsg"
    Write-Info "Commit creado."
} catch {
    Write-Warn "No se creó un commit (posible que no haya cambios para commitear)."
}

# Remote handling
$remotes = try { git remote } catch { '' }
if ([string]::IsNullOrWhiteSpace($remotes)){
    Write-Info "No hay remote configurado."
    $open = Read-Host "Abrir https://github.com/new en el navegador para crear un repo? (y/N)"
    if ($open -eq 'y' -or $open -eq 'Y'){
        Start-Process "https://github.com/new"
        Write-Host "Crea el repo (recomendado: AD_FINEM_WEB). Luego pega la URL remota (HTTPS o SSH) cuando te lo solicite." -ForegroundColor Cyan
    }
    $remoteUrl = Read-Host "Pega la URL remota del repo GitHub (ej: https://github.com/USERNAME/AD_FINEM_WEB.git)"
    if ([string]::IsNullOrWhiteSpace($remoteUrl)){
        Write-Err "No se proporcionó URL remota. Cancelando push.";
        exit 1
    }
    git remote add origin $remoteUrl
} else {
    Write-Info "Remote(s) existentes:"
    git remote -v
    $useExisting = Read-Host "Usar remote existente 'origin'? (Y/n)"
    if ($useExisting -eq 'n' -or $useExisting -eq 'N'){
        $remoteUrl = Read-Host "Pega la nueva URL remota"
        if (-not [string]::IsNullOrWhiteSpace($remoteUrl)){
            git remote add origin $remoteUrl
        }
    }
}

# Push
Write-Info "Pushing to origin main..."
try{
    git push -u origin main
    Write-Info "Push completado. Verifica el repo en GitHub."
} catch {
    Write-Err "Error al hacer push. Si usas HTTPS con autenticación, probablemente necesites un Personal Access Token (PAT) en vez de tu contraseña."
    Write-Host "Si deseas puedo mostrar los pasos para crear un PAT o usar 'gh' (GitHub CLI)." -ForegroundColor Yellow
}
