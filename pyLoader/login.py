import mysql.connector
import password from secrets

def sqlexec(query = None, data = None):
    res = None
    
    try:
        cnx = mysql.connector.connect(user='pi', password=password, database='cc')
        err = None
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
            return
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
            return
        else:
            print(err)
            return

    cur = cnx.cursor()
    #for query, data in queries, datas:
    if query is not None and data is not None:
        cur.execute(query, data)    
        cnx.commit()
    elif 'INSERT INTO' in query and data is None:
        cur.execute(query)    
        cnx.commit()
        #res = cur.fetchall()
    elif 'SELECT' in query and data is None:
        cur.execute(query)
        res = cur.fetchall()


    cur.close()
    cnx.close()
    return res
