<%@ Language="VBScript" %>
<%
' Test ASP dosyası - HTML Tag Matching için
Dim strMessage
strMessage = "Merhaba ASP HTML Tag Matcher!"
%>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>ASP HTML Tag Matcher Test</title>
</head>
<body>
    <div class="container">
        <h1><%=strMessage%></h1>
        
        <div class="content">
            <table class="test-table">
                <thead>
                    <tr>
                        <th>Başlık 1</th>
                        <th>Başlık 2</th>
                    </tr>
                </thead>
                <tbody>
                    <%
                    For i = 1 to 3
                    %>
                    <tr>
                        <td>Satır <%=i%> - Hücre 1</td>
                        <td>Satır <%=i%> - Hücre 2</td>
                    </tr>
                    <%
                    Next
                    %>
                </tbody>
            </table>
        </div>
        
        <div class="form-section">
            <form method="post" action="test.asp">
                <div class="form-group">
                    <label for="name">İsim:</label>
                    <input type="text" id="name" name="name" />
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" />
                </div>
                <button type="submit">Gönder</button>
            </form>
        </div>
    </div>
    
    <script>
        // JavaScript kodu
        console.log("ASP HTML Tag Matcher çalışıyor!");
    </script>
</body>
</html>
