"""Generate the showcase SVG referenced from the "### Diagrams" subsection of docs/contributing/markdown-and-mdx.md.

Regenerate with:

    python3 -m venv .diagrams-venv
    .diagrams-venv/bin/pip install diagrams
    .diagrams-venv/bin/python scripts/diagrams/diagramming-conventions/sample.py

Output lands at static/assets/docs/diagrams/diagramming-conventions_sample.svg.
Requires graphviz (dot) on PATH.
"""

import base64
import re
from pathlib import Path

from diagrams import Cluster, Diagram, Edge
from diagrams.k8s.compute import Pod
from diagrams.k8s.controlplane import APIServer
from diagrams.onprem.client import Client
from diagrams.onprem.compute import Server
from diagrams.onprem.monitoring import Grafana

DATA = "#2563eb"      # data plane
CONTROL = "#4f46e5"   # k8s control plane
LOCAL = "#16a34a"     # local engines
FRONTIER = "#d97706"  # frontier providers (optional)
OBS = "#0f766e"       # observability

out_dir = Path(__file__).resolve().parents[3] / "static" / "assets" / "docs" / "diagrams"
out_dir.mkdir(parents=True, exist_ok=True)
out_stem = out_dir / "diagramming-conventions_sample"

graph_attr = {
    "fontname": "Inter, Arial, sans-serif",
    "fontsize": "18",
    "pad": "0.4",
    "bgcolor": "white",
    "splines": "spline",
    "nodesep": "0.6",
    "ranksep": "0.9",
}

node_attr = {"fontname": "Inter, Arial, sans-serif", "fontsize": "13"}

with Diagram(
    "Conventions showcase",
    filename=str(out_stem),
    outformat="svg",
    show=False,
    graph_attr=graph_attr,
    node_attr=node_attr,
):
    client = Client("Client app")

    with Cluster(
        "Gateway",
        graph_attr={
            "bgcolor": "#eef6ff",
            "pencolor": DATA,
            "penwidth": "2.5",
            "style": "rounded",
            "fontname": "Inter, Arial, sans-serif",
            "fontsize": "15",
        },
    ):
        router = Pod("Router")

    with Cluster(
        "Local engines",
        graph_attr={
            "bgcolor": "#f0fdf4",
            "pencolor": LOCAL,
            "penwidth": "2",
            "style": "rounded",
            "fontname": "Inter, Arial, sans-serif",
            "fontsize": "15",
        },
    ):
        engine = Server("vLLM")

    with Cluster(
        "Frontier (optional)",
        graph_attr={
            "bgcolor": "#fff7ed",
            "pencolor": FRONTIER,
            "penwidth": "2",
            "style": "rounded,dashed",
            "fontname": "Inter, Arial, sans-serif",
            "fontsize": "15",
        },
    ):
        provider = Server("Anthropic")

    with Cluster(
        "Control plane",
        graph_attr={
            "bgcolor": "#eef2ff",
            "pencolor": CONTROL,
            "penwidth": "2.5",
            "style": "rounded",
            "fontname": "Inter, Arial, sans-serif",
            "fontsize": "15",
        },
    ):
        model_cr = APIServer("Model CR")

    with Cluster(
        "Observability",
        graph_attr={
            "bgcolor": "#f0fdfa",
            "pencolor": OBS,
            "penwidth": "2",
            "style": "rounded",
            "fontname": "Inter, Arial, sans-serif",
            "fontsize": "15",
        },
    ):
        grafana = Grafana("Grafana")

    client >> Edge(color=DATA, penwidth="2.4") >> router
    router >> Edge(color=DATA, penwidth="2.4", label="local") >> engine
    router >> Edge(color=FRONTIER, penwidth="2.4", style="dashed", label="egress") >> provider
    model_cr >> Edge(color=CONTROL, penwidth="2.4", style="dashed", label="reconcile") >> router
    engine >> Edge(color=OBS, penwidth="1.8", style="dotted", label="metrics") >> grafana


def inline_png_icons(svg_path: Path) -> None:
    """Rewrite absolute PNG xlink:href references as base64 data URIs.

    The `diagrams` package emits `xlink:href="/abs/path/icon.png"` for every
    node, which does not resolve when the SVG is served by a browser. Inlining
    the PNGs makes the SVG self-contained.
    """
    text = svg_path.read_text(encoding="utf-8")
    pattern = re.compile(r'xlink:href="(?P<path>/[^"]+\.png)"')

    def replace(match: re.Match) -> str:
        png_path = Path(match.group("path"))
        if not png_path.is_file():
            return match.group(0)
        data = base64.b64encode(png_path.read_bytes()).decode("ascii")
        return f'xlink:href="data:image/png;base64,{data}"'

    svg_path.write_text(pattern.sub(replace, text), encoding="utf-8")


inline_png_icons(out_stem.with_suffix(".svg"))
