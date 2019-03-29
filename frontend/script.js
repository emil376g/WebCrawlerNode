$(document).ready(function() {
    var rep;
    var pattern = $('#pattern');
    $('#data').hide();
    $('#result').hide();
    $('#searcing').hide();
    $("#postdata").hide();
    $("#response").hide();
    $('#WebCrawlCaller').submit(function(e) {
        $("#WebCrawlCaller").hide();
        $('#searcing').show();

        e.preventDefault();
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://127.0.0.1:3000/crawl?key=78942ef2c1c98bf10fca09c808d718fa3734703e",
            "method": "GET",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                "url": $("#url").val(),
                "selector": $("#selector").val()
            }
        };

        $.ajax(settings).done(function(response) {
            $('#searcing').hide();

            $("#response").show();
            rep = JSON.parse(JSON.stringify(response));
            console.log(JSON.stringify(rep));
            rep.forEach(element => {
                for (let index = 0; index < element.length; index++) {
                    $("#dump").append(JSON.stringify(element[index]).substring((0 + 1), JSON.stringify(element[index]).length - 1) + '\n');
                }
            });
        });
    });
    pattern.change(function(e) {
        $('#result').show();
        $("#postdata").show();
        $('#data').show();
        e.preventDefault();
        $('#data').html('');
        $('#data').append('<tr></tr>');
        for (let p = 0; p < pattern.val().length; p++) {

            switch (pattern.val().charAt(p)) {
                case 'd':
                    $('#data tr:first').append('<th class="date">Date</th>');
                    break;
                case 't':
                    $('#data tr:first').append('<th class="title">Title</th>');
                    break;
                case 'b':
                    $('#data tr:first').append('<th class="description">Description</th>');
                    break;
                case 'p':
                    $('#data tr:first').append('<th class="place">Place</th>');
                    break;
                default:
                    break;
            }
        }
        for (let j = 0; j < rep.length; j++) {
            let i = 0;

            for (let index = 0; index < rep[j].length / 4; index++) {
                $('#data tr:last').after('<tr class="data"></tr>');
                for (let k = 0; k < pattern.val().length; k++) {
                    if (pattern.val().charAt(k) == 'd' || pattern.val().charAt(k) == 'b' || pattern.val().charAt(k) == 't' || pattern.val().charAt(k) == 'p') {
                        $("#data tr:last").append('<td><input class="' + pattern.val().charAt(k) + '" type="text"></td>');
                    }
                }
                for (let index2 = 0; index2 < $('#data tr:last').children().length; index2++) {
                    if ($('#data tr:last').children()[index2].value == '')
                        i++;
                    if (i >= 4) {
                        $('#data tr:last').remove();
                    }
                }
            }
        }
        let indexer = 0;
        for (let index1 = 0; index1 < rep.length; index1++) {
            for (let index2 = 0; index2 < rep[index1].length / pattern.val().length; index2++) {
                for (let index = 0; index < pattern.val().length; index++) {
                    switch (pattern.val().charAt(index)) {
                        case 'd':
                            $('.d:eq(' + index2 + ')').val(JSON.stringify(rep[index1][indexer]));
                            indexer++;
                            break;
                        case 't':
                            $('.t:eq(' + index2 + ')').val(JSON.stringify(rep[index1][indexer]));
                            indexer++;
                            break;
                        case 'b':
                            if (JSON.stringify(rep[index1][index2]) != undefined) {
                                $('.b:eq(' + index2 + ')').val(JSON.stringify(rep[index1][indexer]));
                            }
                            indexer++;
                            break;
                        case 'p':
                            $('.p:eq(' + index2 + ')').val(JSON.stringify(rep[index1][indexer]));
                            indexer++;
                            break;
                        default:
                            indexer++;
                            break;
                    }
                }
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
            for (let input = 0; input < 4; input++) {
                if ($("#data").children()[element].children[input].children[0] != undefined) {
                    switch (pattern.val().charAt(input)) {
                        case 'd':
                            date = $("#data").children()[element].children[input].children[0].value;
                            break;
                        case 't':
                            title = $("#data").children()[element].children[input].children[0].value;
                            break;
                        case 'b':
                            des = $("#data").children()[element].children[input].children[0].value;
                            break;
                        case 'p':
                            place = $("#data").children()[element].children[input].children[0].value;
                            break;
                        default:
                            break;
                    }
                }
            }
            if (title != undefined && place != undefined && date != undefined) {
                json.push({
                    date: date,
                    place: place,
                    title: title,
                    description: des,
                    url: $("#url").val(),
                    datastructur: pattern.val(),
                    crawlClass: $("#selector").val()
                });
                console.log(JSON.stringify(json));
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://127.0.0.1:3000/crawl?key=78942ef2c1c98bf10fca09c808d718fa3734703e",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "processData": false,
                    "data": JSON.stringify(json)
                };

                $.ajax(settings).done(function(response) {

                });
                json = [];
            }
        }
    });
    $('#dump').change(function(e) {
        e.preventDefault();
        let tempPlaceHolder = [];
        let result = [];
        for (let index = 0; index < $("#dump").val().split('\n').length; index++) {
            tempPlaceHolder.push($("#dump").val().split('\n')[index]);
        }
        result.push(tempPlaceHolder);
        rep = result;
    });
});