import os
import platform
import socket
import subprocess
from datetime import datetime
from flask import Flask, jsonify, render_template

app = Flask(__name__)


def run_cmd(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True, shell=True)
    out = (result.stdout or result.stderr or "").strip()
    return out if out else "Sem saída do comando."


def get_basic_info():
    hostname = socket.gethostname()
    os_name = platform.system()
    os_ver = platform.version()
    return f"Host: {hostname}\nSO: {os_name}\nVersão: {os_ver}"


def ping_test(host="8.8.8.8"):
    cmd = f"ping -n 4 {host}" if platform.system() == "Windows" else f"ping -c 4 {host}"
    return run_cmd(cmd)


def dns_test(domain="google.com"):
    try:
        ip = socket.gethostbyname(domain)
        return f"DNS OK: {domain} -> {ip}"
    except Exception as e:
        return f"DNS FALHOU: {e}"


def ip_info():
    if platform.system() == "Windows":
        return run_cmd("ipconfig /all")
    return run_cmd("ip a")


def system_usage():
    if platform.system() == "Windows":
        cpu = run_cmd("wmic cpu get loadpercentage")
        mem = run_cmd(
            "wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /Value")
        disk = run_cmd("wmic logicaldisk get size,freespace,caption")
        return f"CPU:\n{cpu}\n\nMEM:\n{mem}\n\nDISCO:\n{disk}"
    return run_cmd("top -bn1 | head -n 20")


def save_report(content):
    os.makedirs("reports", exist_ok=True)
    filename = f"reports/report_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.txt"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    return filename


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/api/info")
def api_info():
    return jsonify({"result": get_basic_info()})


@app.get("/api/ping")
def api_ping():
    return jsonify({"result": ping_test()})


@app.get("/api/dns")
def api_dns():
    return jsonify({"result": dns_test()})


@app.get("/api/ip")
def api_ip():
    return jsonify({"result": ip_info()})


@app.get("/api/usage")
def api_usage():
    return jsonify({"result": system_usage()})


@app.get("/api/report")
def api_report():
    report = []
    report.append("=== IT Helpdesk Toolkit Report ===")
    report.append(f"Data/Hora: {datetime.now()}")
    report.append("\n[INFO BÁSICA]\n" + get_basic_info())
    report.append("\n[PING]\n" + ping_test())
    report.append("\n[DNS]\n" + dns_test())
    report.append("\n[IP/REDE]\n" + ip_info())
    report.append("\n[USO DO SISTEMA]\n" + system_usage())

    content = "\n".join(report)
    path = save_report(content)
    return jsonify({"result": f"Relatório gerado em: {path}", "path": path})


if __name__ == "__main__":
    app.run(debug=True)
