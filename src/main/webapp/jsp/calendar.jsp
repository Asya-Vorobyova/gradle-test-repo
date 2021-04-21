<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" session="true"
%><%@include file="/WEB-INF/include/constants.jinc"
%><!-- START: calendar -->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Kalender</title>
    <script type="text/javascript" src="<struts:url value="/js/calendar.js" encode="false" />"></script>
    <script type="text/javascript" language="JavaScript">
        <!--
        var currentDate = new Date();
        currentDate.setTime(<struts:property value="time" />);
        // den ersten Tag, der im Kalender angezeigt werden soll, ermitteln.
        var firstDay = new Date(currentDate);
        firstDay.setDate(1);
        firstDay.setDate(1 - (7 + firstDay.getDay() - 1) % 7);
        // naechstes Jahr
        var nextYear = new Date(currentDate);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        // vorheriges Jahr
        var previousYear = new Date(currentDate);
        previousYear.setFullYear(previousYear.getFullYear() - 1);
        // Moante
        var month = new Date(currentDate);
        //-->
    </script>
    <link rel="stylesheet" type="text/css" href="<struts:url value="/css/calendar.css"  encode="false" />" />
</head>
<body>
<div id="content">
    <div class="title">
        <h1 class="title"><web:icon template="image" key="title.image" /></h1>
    </div>
    <div class="year">
        <div>
        <span class="arrow-left">
          <a href="javascript:changeDate(window.location, previousYear.getTime());"><web:icon template="image" key="arrow.left.image" /></a>
        </span>
            <h1 class="year-title">
          <span>
            <struts:text name="year.name" />
            <script type="text/javascript" language="JavaScript">
            <!--
            document.write(currentDate.getFullYear());
            //-->
            </script>
          </span>
            </h1>
            <span class="arrow-right">
          <a href="javascript:changeDate(window.location, nextYear.getTime());"><web:icon template="image" key="arrow.right.image" /></a>
        </span>
        </div>
    </div>
    <div class="month">
        <h1><struts:text name="month.name" /></h1>
        <div>
            <script type="text/javascript" language="JavaScript">
                <!--
                for(var i = 1; i <= 12; i++) {
                    var monthStyle = currentDate.getMonth() + 1 == i ? "selected-month" : "unselected-month"

                    month.setMonth(i - 1);
                    document.write('<span class="' + monthStyle + '"><a href="javascript:changeDate(window.location, ' + month.getTime() + ');">' + i + '</a></span>');
                }
                //-->
            </script>
        </div>
        <table border="0" cellspacing="0" cellpadding="0">
            <tr>
            </tr>
        </table>
    </div>
    <div class="day">
        <div>
            <table>
                <tr>
                    <struts:iterator value="days" status="dayStatus"><th class="week<struts:if test="#dayStatus.index > 4">end</struts:if>"><struts:property /></th></struts:iterator>
                </tr>
                <script language="JavaScript">
                    <!--
                    var currentDay = new Date(firstDay);

                    while(currentDay.getMonth() == currentDate.getMonth() || currentDay.getMonth() == firstDay.getMonth()) {
                        document.write('<tr>');
                        for(var weekDay = 0; weekDay < 7; weekDay++) {
                            var dayStyle = "unselected-day";

                            if (currentDay.getDate() == currentDate.getDate() && currentDay.getMonth() == currentDate.getMonth())
                                dayStyle = "selected-day";
                            else if(currentDay.getDay() % 6 == 0)
                                if(currentDay.getMonth() == this.currentDate.getMonth())
                                    dayStyle = "current-weekend";
                                else
                                    dayStyle = "other-weekend";
                            else
                            if(currentDay.getMonth() == this.currentDate.getMonth())
                                dayStyle = "current-week";
                            else
                                dayStyle = "other-week";
                            document.write('<td class="' + dayStyle + '"><a href="javascript:changeDate(window.location, ' + currentDay.getTime() + ');">' + currentDay.getDate() + '</a></td>');
                            currentDay.setDate(currentDay.getDate()+1);
                        }
                        document.write('</tr>');
                    }
                    //-->
                </script>
            </table>
        </div>
    </div>
    <div class="submit">
        <a href="javascript:submitDate();"><web:icon template="image" key="submit.image" /></a>
    </div>
</div>
</body>
</html>
<!-- END: calendar -->