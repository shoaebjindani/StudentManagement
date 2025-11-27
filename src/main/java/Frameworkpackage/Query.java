package Frameworkpackage;

import java.util.HashMap;

public class Query {
    
    public String tableName;
    public String queryMode;
    public HashMap<String, Object> keyValueMap;
    public HashMap<String, Object> whereValueMap;
    
    public Query(String tableName, String queryMode, HashMap<String, Object> keyValueMap,HashMap<String, Object> whereValueMap) {
        super();
        this.tableName = tableName;
        this.queryMode = queryMode;
        this.keyValueMap = keyValueMap;
        this.whereValueMap = whereValueMap;
    }
    public Query(String tableName, String queryMode, HashMap<String, Object> keyValueMap) {
        super();
        this.tableName = tableName;
        this.queryMode = queryMode;
        this.keyValueMap = keyValueMap;
        this.whereValueMap = whereValueMap;
    }

    @Override
    public String toString() {
        return "Query [tableName=" + tableName + ", queryMode=" + queryMode + ", keyValueMap=" + keyValueMap
                + ", whereValueMap=" + whereValueMap + "]";
    }

    
    
    
}