#!/usr/bin/python
"""
Target JSON format:
[{'date': {'year': 2003, 'month': 09, 'day': 28}, 'data': {'United States': 902, 'Alabama': 606}},
{'date': ...} ...
]
"""
import csv, json, sys

data = []
fname_in = sys.argv[1]
fp_csv = csv.reader(open(fname_in))
header = fp_csv.next()
                    
for row in fp_csv:
  values = filter(lambda d:d[1], zip(header[1:], row[1:]))
  values = map(lambda d:(d[0],int(d[1])), values)
  d = {
    'date': dict(zip(("year", "month", "day"), map(int, row[0].split('-')))),
    'data': dict(values)
  }
  data.append(d)
fname_out = fname_in.rpartition('.')[0]+".json"
json.dump(data, open(fname_out, "w"))
  
  
