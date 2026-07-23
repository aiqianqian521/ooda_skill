#!/usr/bin/env bash
# OODA Skill 多环境安装脚本
# 自动检测当前环境（CodeFuse / Claude Code / Codex）并安装到正确路径
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_NAME="ooda"

# 标准副本路径
SHARED_DIR="$HOME/.agents/skills/$SKILL_NAME"

echo "=== OODA Skill 安装 ==="

# 1. 部署标准副本到 .agents/skills/
echo "[1/3] 部署标准副本到 $SHARED_DIR ..."
mkdir -p "$SHARED_DIR"
cp "$SCRIPT_DIR/SKILL.zh-CN.md" "$SHARED_DIR/SKILL.md"
cp -r "$SCRIPT_DIR/agents" "$SHARED_DIR/" 2>/dev/null || true
cp -r "$SCRIPT_DIR/references" "$SHARED_DIR/" 2>/dev/null || true
cp -r "$SCRIPT_DIR/tests" "$SHARED_DIR/" 2>/dev/null || true

# Windows CRLF 修复
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    sed -i 's/$/\r/' "$SHARED_DIR/SKILL.md"
fi

# 2. 检测并安装到各环境
echo "[2/3] 检测 Agent 环境..."

link_or_copy() {
    local target="$1"
    local source="$2"
    local name="$3"

    echo -n "  $name: "
    if [ -L "$target" ] || [ -d "$target" ]; then
        echo "已存在，跳过"
        return
    fi

    mkdir -p "$(dirname "$target")"

    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
        # Windows: 尝试 junction，失败则复制
        cmd //c "mklink /J \"${target//\//\\}\" \"${source//\//\\}\"" 2>/dev/null && echo "junction 已创建" || {
            cp -r "$source" "$target"
            echo "复制完成（junction 不可用）"
        }
    else
        # Mac/Linux: symlink
        ln -sfn "$source" "$target"
        echo "symlink 已创建"
    fi
}

# CodeFuse
CFUSE_SKILLS="$HOME/.codefuse/engine/cc/skills"
if [ -d "$CFUSE_SKILLS" ]; then
    link_or_copy "$CFUSE_SKILLS/$SKILL_NAME" "$SHARED_DIR" "CodeFuse"
fi

# Claude Code 独立版
CLAUDE_SKILLS="$HOME/.claude/skills"
if [ -d "$CLAUDE_SKILLS" ]; then
    link_or_copy "$CLAUDE_SKILLS/$SKILL_NAME" "$SHARED_DIR" "Claude Code"
fi

# Codex
CODEX_SKILLS="$HOME/.codex/skills"
if [ -d "$CODEX_SKILLS" ]; then
    link_or_copy "$CODEX_SKILLS/$SKILL_NAME" "$SHARED_DIR" "Codex"
fi

# Kilo Code
KILO_SKILLS="$HOME/.kilocode/skills"
if [ -d "$KILO_SKILLS" ]; then
    link_or_copy "$KILO_SKILLS/$SKILL_NAME" "$SHARED_DIR" "Kilo Code"
fi

echo ""
echo "[3/3] 安装完成！"
echo ""
echo "已安装的环境:"
echo "  - 标准副本: $SHARED_DIR"
[ -d "$CFUSE_SKILLS/$SKILL_NAME" ] && echo "  - CodeFuse:  $CFUSE_SKILLS/$SKILL_NAME"
[ -d "$CLAUDE_SKILLS/$SKILL_NAME" ] && echo "  - Claude Code: $CLAUDE_SKILLS/$SKILL_NAME"
[ -d "$CODEX_SKILLS/$SKILL_NAME" ] && echo "  - Codex:    $CODEX_SKILLS/$SKILL_NAME"
[ -d "$KILO_SKILLS/$SKILL_NAME" ] && echo "  - Kilo Code: $KILO_SKILLS/$SKILL_NAME"
echo ""
echo "使用方式: 在对应的 Agent 中输入 /ooda"