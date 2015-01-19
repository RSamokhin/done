import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;
import org.apache.commons.lang.StringUtils;
public class BaseStatement {
    public Statement statement = null;
    public BaseStatement (BaseConnector connector) throws SQLException {
       statement = connector.connection.createStatement();
    }
    public void makeQuery (String type, String table , String[] columns, String[][] cdata, String[] params){
        switch (type){
            case "get":
                combineSelectQuery(table,columns,cdata,params);
                break;
        }
    }
    private String combineSelectQuery (String table,String[]columns,String[][]cdata, String[] params){
        StringBuilder query = new StringBuilder();
        query.append("Select ");
        query.append(StringUtils.join(columns, ","));
        query.append(" from ");
        query.append(table);
        if (cdata.length>0){
            query.append(" where ");
            for (String[] cdata1 : cdata) {
                query.append(cdata1[0]).append(cdata1[1]).append(cdata1[2]).append(" ");
            }
        }
        if (params.length>0)
            query.append(" ").append(StringUtils.join(params," "));
        return query.toString();
    }
    private String combineInsertQuery (String table,String[]columns,String[][]cdata){
        StringBuilder query = new StringBuilder();
        query.append("Insert Into ");
        query.append(table).append(" (");
        query.append(StringUtils.join(columns, ","));
        query.append(table).append(") Values (");
        for (String[] cdatarow : cdata)
            query.append(StringUtils.join(cdatarow, ","));
        query.append(table).append(")");
        return query.toString();
    }    
}
