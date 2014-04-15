package tulapi.tools;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

public class IndexText {

  public static void main(String[] args) throws Exception {
    Map<String, Integer> index = new HashMap<String, Integer>();
    ArrayList<String> order = new ArrayList<String>();

//    File file = new File("src/main/resources/prikazki.txt");
    File file = new File("src/main/resources/loshata_duma.txt");
    BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
    String line;

    while ((line = reader.readLine()) != null) {
      addLineToIndex(line, index);
    }
    reader.close();

    sortIndex(index, order);

    for (int i = 0; i < 100; i++) {
      String word = order.get(i);
      System.out.println("" + word + "\t\t\t" + index.get(word));
    }

    System.out.println(" total words: " + index.size());
  }

  private static void addLineToIndex(String line, Map<String, Integer> index) {
    StringTokenizer tokens = new StringTokenizer(line, " ");

    while (tokens.hasMoreTokens()) {
      String word = tokens.nextToken();

      if (acceptWord(word)) {
        word = cleanWord(word);
        addWordToIndex(word, index);
      }
    }
  }

  private static void addWordToIndex(String word, Map<String, Integer> index) {
    Integer count = index.get(word);

    if (count != null) {
      index.put(word, count + 1);
    } else {
      index.put(word, 1);
    }
  }

  private static boolean acceptWord(String word) {
    return Character.isAlphabetic(word.charAt(0));
  }

  private static String cleanWord(String word) {
    word = word.toLowerCase();

    if (word.startsWith("\"")) {
      word = word.substring(1);
    } else if (word.endsWith("\"")) {
      word = word.substring(0, word.length() - 1);
    } else if (word.endsWith(".")) {
      word = word.substring(0, word.length() - 1);
    } else if (word.endsWith(",")) {
      word = word.substring(0, word.length() - 1);
    } else if (word.endsWith(":")) {
      word = word.substring(0, word.length() - 1);
    } else if (word.endsWith(";")) {
      word = word.substring(0, word.length() - 1);
    } else if (word.endsWith("!")) {
      word = word.substring(0, word.length() - 1);
    } else if (word.endsWith("?")) {
      word = word.substring(0, word.length() - 1);
    }

    return word;
  }

  private static void sortIndex(final Map<String, Integer> index, final ArrayList<String> order) {
    order.addAll(index.keySet());
    Collections.sort(order, new Comparator<String>() {
      public int compare(String o1, String o2) {
        return index.get(o2) - index.get(o1);
      }
    });
  }

}
