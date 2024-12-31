# Copyright (c) 2024 Microsoft Corporation.
# Licensed under the MIT License

"""A module containing run and _compute_leiden_communities methods definitions."""

import logging
from typing import Any

import networkx as nx
from graspologic.partition import hierarchical_leiden

from graphrag.index.graph.utils import stable_largest_connected_component

log = logging.getLogger(__name__)


# Taken from graph_intelligence & adapted
def _compute_leiden_communities(
    graph: nx.Graph | nx.DiGraph,
    max_cluster_size: int,
    use_lcc: bool,
    seed=0xDEADBEEF,
) -> dict[int, dict[str, int]]:
    """Return Leiden root communities."""
    if use_lcc:
        graph = stable_largest_connected_component(graph)

    community_mapping = hierarchical_leiden(
        graph, max_cluster_size=max_cluster_size, random_seed=seed
    )
    results: dict[int, dict[str, int]] = {}
    for partition in community_mapping:
        results[partition.level] = results.get(partition.level, {})
        results[partition.level][partition.node] = partition.cluster

    return results

