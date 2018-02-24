import random
import datetime

def randomizer(pickee):
    """you can pick your friends and you can pick your nose
       and this can pick randomly from a list"""

    random_pick = random.SystemRandom().choice(pickee)
    return random_pick


def makeDates(daysBack):
    """makes a list of dates starting today and going daysBack days"""

    today = datetime.datetime.today()
    dateList = []
    for date in range(0, daysBack):
        # slices return from time operation to only include Y-MM-DD HH:MM:SS
        # excludes miliseconds
        dateList.append(str(today - datetime.timedelta(days = daysBack))[0:19])

    return dateList


def makeSample():
    sample = {
        'sampleData' : {
            'SAMPLE_NAME' : '',
            'SAMPLE_TYPE' : '',
            'STATUS' : '',
            'IN_SPEC' : '',
            'LOGIN_DATE' : '',
            'DATE_COMPLETED': ''
        },
        'testData' : {
            'TEST_LIST' : [],
            'IN_SPEC' : []
        },
        'resultData': {
            'ENTRY' : [],
            'IN_SPEC' : []
        }
    }


    sampleData = sample['sampleData']
    testData = sample['testData']
    resultData = sample['resultData']

    # 9Y and 1 N == 90% chance of being in spec
    specs = ('Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'N')

    
    def propagateSpecs():
        for spec in resultData['IN_SPEC']:
            testData['IN_SPEC'].append(spec)
        if 'N' in resultData['IN_SPEC']:
            sampleData['IN_SPEC'] = 'N'
        elif 'N' not in resultData['IN_SPEC']:
            sampleData['IN_SPEC'] = 'Y'
        return

    def makeTestData():
        """adds tests to data_saple dict inside data_samples list.
           randomly picks test list based on sample type"""

        testlists = { 'Final' : ['FSO2', 'TSO2', 'Ethanol', 'pH', 'TA'],
                       'Pre' : ['FSO2', 'TSO2', 'Ethanol', 'pH', 'TA', 'RS', 'VA'],
                       'Full' :
                           ['FSO2', 'TSO2', 'Ethanol', 'pH', 'TA', 'RS', 'VA',
                            'Malic', 'Lactic'],
                       'SO2CHK' : ['FSO2', 'TSO2', 'Ethanol'],
                       'RS' : ['RS'],
                       'ML' : ['Malic', 'Lactic'],
                       'Metals' : ['Copper', 'Iron', 'Lead', 'Arsenic'],
                       'TCA' : ['4EP/4EG'],
                       'Sulfides' : ['Sulfides'],
                       'Weightfactor' : ['Specific Gravity'],
                       'Low Ethanol' : ['Low Ethanol'] }
        
        testData['TEST_LIST'] = randomizer(testlists.values())       
        return 
    
    def makeResultData():
        for test in testData['TEST_LIST']:
            resultData['ENTRY'].append(test)
        for test in resultData['ENTRY']:
            resultData['IN_SPEC'].append(randomizer(specs))
        return
    
    def makeSampleData():
        """creates a dictionary object containing randomly generated 
           sample data"""
        def makeSampleName():
            """randompick generates random sample name"""
            vintages = (15, 16, 17)
            brands = ('MAT', 'GT', 'W3', 'POM', 'SH', 'SG', 'JAR', 'A3')
            varietals = ('ROSE', 'RED', 'WHITE', 'MER', 'ZN',
                         'WZN', 'SB', 'CH', 'CS', 'MLB','PN', 'PG')

            sampleData['SAMPLE_NAME'] = '%s_%s_%s' %(
                randomizer(vintages), randomizer(brands), randomizer(varietals))
            return

        makeSampleName()
        sampleData['SAMPLE_TYPE'] = randomizer(('OUTSIDE', 'BOTTLING', 'DAILY'))
        sampleData['STATUS'] = randomizer(('INCOMPLETE', 'IN_PROGRESS',
                                           'COMPLETE', 'AUTHORIZED'))
        
        if sampleData['SAMPLE_TYPE'] == 'OUTSIDE':
            sampleData['LOGIN_DATE'] = randomizer(makeDates(10))        
        elif sampleData['SAMPLE_TYPE'] in ('BOTTLING', 'DAILY'):
            sampleData['LOGIN_DATE'] = randomizer(makeDates(10))

        if sampleData['STATUS'] in ('AUTHORIZED', 'COMPLETE'):
            sampleData['DATE_COMPLETED'] = datetime.datetime.today().strftime(
                "%Y-%m-%d %H:%M:%S")
        elif sampleData['STATUS'] == 'Incomplete':
            sampleData['DATE_COMPLETED']  = ''
        return
                                                     
    makeTestData()
    makeResultData()
    makeSampleData()
    propagateSpecs()               

    return sample

sample = makeSample()

print "\nWR DATAMAKER : sampleData %s \n" %sample['sampleData']
print "WR DATAMAKER : testData %s \n" %sample['testData']
print "WR DATAMAKER : resultData %s \n" %sample['resultData']
                                                     
                                                     
                                                   
