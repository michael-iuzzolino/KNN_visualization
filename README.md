# K Nearest Neighbors Visualization

A simple KNN visualization tool with basic interactivity enabled. Currently, this visualization is mostly educational in that it allows for a quick and intuitive exploration of what a KNN algorithm is doing. A variety of settings are allowed, such as the number of training data points (all randomly generated) that the KNN mapping is created from, the value of K, the resolution of the mapping, etc.

For example, setting K equal to an equal number gives rise to undetermined points, represented by green circles, due to the algorithm's majority-vote classification scheme. If K = 2 and if the 2 nearest neighbors to a test point are of different labels, then a majority vote is unreachable and the test point must be classified as undetermined. The KNN mapping is color coded to represent the classification (or undeterminability). Mouseover each of the test points reveals the K nearest neighbors that voted on its classification. 


<img src="resources/knn.png" width=500></img>
