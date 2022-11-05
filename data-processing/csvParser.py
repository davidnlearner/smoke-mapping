import csv
from datetime import datetime, timedelta

def csvParser():
    with open('data-processing/weekly_county_data.csv', 'w', newline='') as outputfile:
        weeklywriter = csv.writer(outputfile, delimiter=' ', quotechar='|', quoting=csv.QUOTE_MINIMAL)
        with open('data/full_daily_county_data.csv', 'r', newline='') as csvfile:
            basefile = csv.reader(csvfile, delimiter=' ', quotechar='|')
            count = 0
            geoId = 0
            print("starting...")
            for row in basefile:
                count +=1
                if count != 1:
                    rowList = row[0].split(',')
                    entryGeoId = int(rowList[0].strip('\"'))
                    stringDate = rowList[1].strip('\"')
                    entryDate = datetime.strptime(stringDate, '%Y%m%d')

                    if entryGeoId != geoId:
                        geoId = entryGeoId
                        lastdate = entryDate
                        weeklywriter.writerow(row)
                    else:
                        if entryDate - lastdate >= timedelta(days = 7):
                            weeklywriter.writerow(row)
                            lastdate = entryDate

                    if count%100000 == 0:
                        print(f'roughly {count/23000} % of the way there')


if __name__ == '__main__':
    csvParser()
