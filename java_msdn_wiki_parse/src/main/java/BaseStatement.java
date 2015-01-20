import java.sql.SQLException;
import java.sql.Statement;
import org.apache.commons.lang.StringUtils;
public class BaseStatement {
    public Statement statement = null;
    public BaseStatement (BaseConnector connector) throws SQLException {
       statement = connector.connection.createStatement();
    }
    public void makeQuery (String type, String table , String[] columns, String[][] cdata, String[] params) throws SQLException{
        String query = null;
        switch (type){
            case "get":
                combineSelectQuery(table,columns,cdata,params);
                break;
            case "insert":
                query = combineInsertQuery(table,columns,params);
                statement.executeUpdate(query);
                statement.close();
                break; 
            case "delete":
                query = combineDeleteQuery(table,cdata);
                statement.executeUpdate(query);
                statement.close();
                break;
        }
    }
    private String combineDeleteQuery (String table,String[][]cdata){
        StringBuilder query = new StringBuilder();
        query.append("Delete from ");
        query.append(table);
        if (cdata.length>0){
            query.append(" where ");
            for (String[]cdatarow:cdata)
                query.append(cdatarow[0]).append(cdatarow[1]).append("'").append(cdatarow[2]).append("'").append(" and ");
            query.setLength(query.length()-4);
        }
        return query.toString();
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
    private String combineInsertQuery (String table,String[]columns,String[]params){
        StringBuilder query = new StringBuilder();
        query.append("Insert Into ");
        query.append(table).append(" (");
        query.append(StringUtils.join(columns, ","));
        query.append(") Values ('");
        query.append(StringUtils.join(params, "','"));
        query.append("')");
        //System.out.println(query);
        return query.toString();
    }    
}
