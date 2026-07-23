# OODA Skill 多环境安装脚本 (PowerShell)
# 自动检测环境并安装到正确路径

$SkillName = "ooda"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SharedDir = "$env:USERPROFILE\.agents\skills\$SkillName"

Write-Host "=== OODA Skill 安装 ===" -ForegroundColor Cyan

# 1. 部署标准副本
Write-Host "[1/3] 部署标准副本到 $SharedDir ..."
New-Item -ItemType Directory -Force -Path $SharedDir | Out-Null
Copy-Item "$ScriptDir\SKILL.zh-CN.md" "$SharedDir\SKILL.md" -Force
foreach ($d in @("agents", "references", "tests")) {
    if (Test-Path "$ScriptDir\$d") {
        Copy-Item "$ScriptDir\$d" "$SharedDir\" -Recurse -Force
    }
}

# 2. 检测并链接
Write-Host "[2/3] 检测 Agent 环境..."
function Link-Skill {
    param($TargetDir, $AgentName)
    $link = "$TargetDir\$SkillName"
    if (Test-Path $link) {
        Write-Host "  $AgentName`t: 已存在，跳过" -ForegroundColor Gray
        return
    }
    New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null
    try {
        cmd /c "mklink /J `"$link`" `"$SharedDir`"" 2>$null
        Write-Host "  $AgentName`t: junction 已创建" -ForegroundColor Green
    } catch {
        Copy-Item $SharedDir $link -Recurse -Force
        Write-Host "  $AgentName`t: 复制完成" -ForegroundColor Yellow
    }
}

$envs = @(
    @{Path="$env:USERPROFILE\.codefuse\engine\cc\skills"; Name="CodeFuse"},
    @{Path="$env:USERPROFILE\.claude\skills";            Name="Claude Code"},
    @{Path="$env:USERPROFILE\.codex\skills";             Name="Codex"},
    @{Path="$env:USERPROFILE\.kilocode\skills";          Name="Kilo Code"}
)

foreach ($e in $envs) {
    if (Test-Path $e.Path) {
        Link-Skill $e.Path $e.Name
    }
}

Write-Host ""
Write-Host "[3/3] 安装完成！" -ForegroundColor Green
Write-Host "使用方式: 在对应的 Agent 中输入 /ooda"