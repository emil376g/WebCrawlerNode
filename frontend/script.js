$(document).ready(function() {
  var rep;
  var pattern = $("#pattern");
  $("#data").hide();
  $("#result").hide();
  $("#searcing").hide();
  $("#postdata").hide();
  $("#response").hide();
  $("#WebCrawlCaller").submit(function(e) {
    $("#WebCrawlCaller").hide();
    $("#searcing").show();

    e.preventDefault();
    var settings = {
      async: true,
      crossDomain: true,
      url:
        "http://127.0.0.1:65432/crawl?key=78942ef2c1c98bf10fca09c808d718fa3734703e",
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        url: $("#url").val(),
        selector: $("#selector").val()
      }
    };

    $.ajax(settings).done(function(response) {
      $("#searcing").hide();

      $("#response").show();
      rep = JSON.parse(JSON.stringify(response));
      console.log(JSON.stringify(rep));
      rep.forEach(element => {
        for (let index = 0; index < element.length; index++) {
          $("#dump").append(
            JSON.stringify(element[index]).substring(
              0 + 1,
              JSON.stringify(element[index]).length - 1
            ) + "\n"
          );
        }
      });
    });
  });
  pattern.change(function(e) {
    $("#result").show();
    $("#postdata").show();
    $("#data").show();
    e.preventDefault();
    $("#data").html("");
    $("#data").append("<tr></tr>");
    for (let p = 0; p < pattern.val().length; p++) {
      switch (pattern.val().charAt(p)) {
        case "d":
          $("#data tr:first").append('<th class="date">Date</th>');
          break;
        case "t":
          $("#data tr:first").append('<th class="title">Title</th>');
          break;
        case "b":
          $("#data tr:first").append(
            '<th class="description">Description</th>'
          );
          break;
        case "p":
          $("#data tr:first").append('<th class="place">Place</th>');
          break;
        case "c":
          $("#data tr:first").append('<th class="category">Category</th>');
          break;
        default:
          break;
      }
    }
    for (let j = 0; j < rep.length; j++) {

      for (let index = 0; index < (rep[j].length / pattern.val().length) - 1; index++) {
        $("#data tr:last").after('<tr class="data"></tr>');
        for (let k = 0; k < pattern.val().length; k++) {
          if (
            pattern.val().charAt(k) == "d" ||
            pattern.val().charAt(k) == "b" ||
            pattern.val().charAt(k) == "t" ||
            pattern.val().charAt(k) == "p" ||
            pattern.val().charAt(k) == "c"
          ) {
            $("#data tr:last").append(
              '<td><input class="' +
                pattern.val().charAt(k) +
                '" type="text"></td>'
            );
          }
        }
      }
    }
    let indexer = 0;
    for (let index1 = 0; index1 < rep.length; index1++) {
      for (
        let index2 = 0;
        index2 < rep[index1].length / pattern.val().length;
        index2++
      ) {
        for (let index = 0; index < pattern.val().length; index++) {
          switch (pattern.val().charAt(index)) {
            case "d":
              $(".d:eq(" + index2 + ")").val(
                JSON.stringify(rep[index1][indexer])
              );
              indexer++;
              break;
            case "t":
              $(".t:eq(" + index2 + ")").val(
                JSON.stringify(rep[index1][indexer])
              );
              indexer++;
              break;
            case "b":
              if (JSON.stringify(rep[index1][index2]) != undefined) {
                $(".b:eq(" + index2 + ")").val(
                  JSON.stringify(rep[index1][indexer])
                );
              }
              indexer++;
              break;
            case "c":
              if (JSON.stringify(rep[index1][index2]) != undefined) {
                $(".c:eq(" + index2 + ")").val(
                  JSON.stringify(rep[index1][indexer])
                );
              }
              indexer++;
              break;
            case "p":
              $(".p:eq(" + index2 + ")").val(
                JSON.stringify(rep[index1][indexer])
              );
              indexer++;
              break;
            default:
              indexer++;
              break;
          }
        }
      }
    }
        for (
          let index2 = 0;
          index2 < $("#data tr:last").children().length;
          index2++
        ) {
            let i = 0;
            console.log($("#data tr:last").children().length)
            if ($("#data tr:last").children()[index2].children[0].value == "" || $("#data tr:last").children()[index2].children[0].value == " ") {
            i++;
          }
          if (i >= $("#data tr:last").children().length) {
            $("#data tr:last").remove();
          }
        }
  });
  $("#postdata").click(function(e) {
    e.preventDefault();
    var json = [];

    for (let element = 0; element < $("#data").children().length; element++) {
      let date;
      let title;
      let des;
      let place;
      let category;
      console.log($(".data").length)
      for (let input = 0; input < $(".data").length; input++) { {
          switch (pattern.val().charAt(input)) {
            case "d":
              date = $(".data:eq( "+ element +")").children[input].children[0]
                .value;
                console.log(date)
              break;
            case "t":
              title = $(".data:eq( "+ element +")").children[input].children[0]
              .value;
                console.log(title)
              break;
            case "b":
              des = $(".data:eq( "+ element +")").children[input].children[0]
              .value;
                console.log(des)
              break;
            case "p":
              place = $(".data:eq( "+ element +")").children[input].children[0]
              .value;
                console.log(place)
              break;
            case "c":
              category = $(".data:eq( "+ element +")").children[input].children[0]
              .value;
                console.log(category)
              break;
            default:
              break;
          }
        }
      }
        json.push({
          date: date,
          place: place,
          title: title,
          category: category,
          description: des,
          url: $("#url").val(),
          datastructur: pattern.val(),
          crawlClass: $("#selector").val()
        });
        console.log(JSON.stringify(json));
        var settings = {
          async: true,
          crossDomain: true,
          url:
          "http://127.0.0.1:65432/crawl?key=78942ef2c1c98bf10fca09c808d718fa3734703e",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          processData: false,
          data: JSON.stringify(json)
        };

        $.ajax(settings).done(function(response) {});
        json = [];
      }
  });
  $("#dump").change(function(e) {
    e.preventDefault();
    let tempPlaceHolder = [];
    let result = [];
    for (
      let index = 0;
      index <
      $("#dump")
        .val()
        .split("\n").length;
      index++
    ) {
      tempPlaceHolder.push(
        $("#dump")
          .val()
          .split("\n")[index]
      );
    }
    result.push(tempPlaceHolder);
    rep = result;
  });
});
