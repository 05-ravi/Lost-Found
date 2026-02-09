// Main entry placeholder
import 'package:flutter/material.dart';

void main() => runApp(const Placeholder());

class Placeholder extends StatelessWidget {
  const Placeholder({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return MaterialApp(home: Scaffold(body: Center(child: Text('Lost and Found App'))));
  }
}
