exclude = ['pluss']
string = "http://pluss.vg.no/kampanjer/pluss/sommer16_1/"
print any(e in string for e in exclude)
